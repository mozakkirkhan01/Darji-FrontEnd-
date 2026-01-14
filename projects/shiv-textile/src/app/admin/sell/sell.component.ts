import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  Sell: any = {};
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  SelectedCustomer: any = {};
  ShopList: any = [];
  PaymentModeList = ConstantData.PaymentModeList;
  TotalSellProduct: any = {};
   customerMobileError: string = '';
  customerMobileWarning: string = '';
  isCustomerSelected: boolean = false;
  showSuggestion: boolean = false;
  suggestedCustomer: any = null;
 private customerInputSubject = new Subject<string>();

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
    
  ) {}

  redUrl: string;
  ngOnInit(): void {
  this.loadingProductStock = true;
  this.getProductStockDetailList();
  this.getGSTList();
  this.getEmployeeList();
  this.employeeDetail = this.localService.getEmployeeDetail();
  this.resetSellProduct();
  this.resetForm();
  this.getShopList();
  
  // Get customer list first, then process route params
  this.getCustomerList();
  this.TotalSellProduct.TotalQuantity = 0;
  
  this.route.queryParams.subscribe((params: any) => {
    this.Sell.SellId = params.id;
    this.redUrl = params.redUrl;
    if (this.Sell.SellId > 0) {
      // Add a small delay to ensure customer list is loaded
      setTimeout(() => {
        this.getSellDetail(this.Sell.SellId);
      }, 100);
    } else {
      this.Sell.SellId = 0;
    }
  });
}


changeCustomerInput(event: any, form: NgForm) {
    const enteredMobile = event;
    this.customerMobileError = '';
    this.customerMobileWarning = '';
    this.isCustomerSelected = false;
    this.showSuggestion = false;
    
    // Trigger debounced validation
    this.customerInputSubject.next(enteredMobile);
    
    // Find exact match in customer list
    const exactMatch = this.CustomerList.find(x1 => x1.MobileNo === enteredMobile);
    
    if (exactMatch) {
      // If exact match found, auto-select the customer
      this.afterCustomerSelected(exactMatch);
      this.isCustomerSelected = true;
    } else {
      // Clear customer data if no match
      this.Sell.MobileNo = enteredMobile;
      this.clearCustomer();
    }
  }

  // Async validation method with better user feedback
  validateCustomerMobileAsync(mobileNo: string) {
    if (!mobileNo || mobileNo.trim() === '') {
      this.customerMobileError = '';
      this.customerMobileWarning = '';
      this.showSuggestion = false;
      return;
    }

    // Find exact match
    const exactMatch = this.CustomerList.find(c => c.MobileNo === mobileNo);
    
    if (exactMatch && !this.isCustomerSelected) {
      this.suggestedCustomer = exactMatch;
      this.customerMobileWarning = `Customer "${exactMatch.CustomerName}" found with this number. Click to select or enter a different number.`;
      this.showSuggestion = true;
      this.customerMobileError = '';
    } else if (exactMatch && this.isCustomerSelected) {
      this.customerMobileError = '';
      this.customerMobileWarning = '';
      this.showSuggestion = false;
    } else {
      // New customer - clear warnings
      this.customerMobileError = '';
      this.customerMobileWarning = '';
      this.showSuggestion = false;
      this.suggestedCustomer = null;
    }
  }

  // Method to handle when user moves to customer name field
  validateCustomerMobileOnNameFocus() {
    const enteredMobile = this.Sell.CustomerAutoComplete;
    
    if (!enteredMobile) {
      return true;
    }

    // Check if the entered mobile number exists in customer list
    const existingCustomer = this.CustomerList.find(c => c.MobileNo === enteredMobile);
    
    if (existingCustomer && !this.isCustomerSelected) {
      this.customerMobileError = 'This number already exists. Please select the existing customer or enter a different number.';
      this.showSuggestion = true;
      this.suggestedCustomer = existingCustomer;
      return false;
    }
    
    return true;
  }

  // Method to select suggested customer
  selectSuggestedCustomer() {
    if (this.suggestedCustomer) {
      this.afterCustomerSelected(this.suggestedCustomer);
      this.customerMobileError = '';
      this.customerMobileWarning = '';
      this.showSuggestion = false;
    }
  }

  // Method to ignore suggestion and continue with new customer
  ignoreSuggestion() {
    this.customerMobileWarning = '';
    this.showSuggestion = false;
    this.suggestedCustomer = null;
    // Keep the mobile number but clear customer data for new entry
    this.Sell.CustomerId = 0;
    this.Sell.CustomerName = "";
    this.Sell.GSTNo = "";
  }

  // Enhanced afterCustomerSelected method
  afterCustomerSelected(item: any) {
    console.log(item);
    
    this.Sell.CustomerId = item.CustomerId;
    this.Sell.CustomerName = item.CustomerName;
    this.Sell.GSTNo = item.GSTNo;
    this.Sell.CustomerAutoComplete = item.MobileNo; // Ensure autocomplete shows selected customer's mobile
    this.isCustomerSelected = true;
    this.customerMobileError = '';
    this.customerMobileWarning = '';
    this.showSuggestion = false;
    
    // Recalculate GST for all products when customer GST changes
    this.recalculateAllProductsGST();
  }

  // Enhanced clearCustomer method
  clearCustomer() {
    this.Sell.CustomerId = 0;
    this.Sell.CustomerName = "";
    this.Sell.GSTNo = "";
    this.isCustomerSelected = false;
    this.customerMobileError = '';
    this.customerMobileWarning = '';
    this.showSuggestion = false;
    this.suggestedCustomer = null;
  }



  getShopList() {
    this.dataLoading = true;
    this.service.getShopList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ShopList = response.ShopList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getSellDetail(SellId: number) {
  this.dataLoading = true;
  this.service.getSellDetail({ SellId: SellId }).subscribe(r1 => {
    let response = r1 as any;
    if (response.Message == ConstantData.SuccessMessage) {
      this.Sell = response.Sell;
      this.Sell.InvoiceDate = this.loadDataService.loadDateYMDT(this.Sell.InvoiceDate);
      this.SellProductList = response.SellProductList;
      this.SellProductList.map(x => x.SearchProduct = `${x.ProductName} - ${x.HSNCode}`);
      
      // Fix: Set the CustomerAutoComplete to the mobile number, not customer ID
      // Find the customer in the list and set the mobile number
      const selectedCustomer = this.CustomerList.find(c => c.CustomerId === this.Sell.CustomerId);
      if (selectedCustomer) {
        this.Sell.CustomerAutoComplete = selectedCustomer.MobileNo;
      } else {
        // If customer not found in current list, you might need to fetch it or set it directly
        this.Sell.CustomerAutoComplete = this.Sell.MobileNo; // assuming MobileNo is available in Sell object
      }
      
      // Recalculate totals after loading data
      this.calculateTotal();
    } else {
      toastr.error(response.Message);
    }
    this.dataLoading = false;
  }, (err => {
    toastr.error("Error Occured while fetching data.");
    this.dataLoading = false;
  }));
}

  EmployeeList: any[] = [];
  getEmployeeList(CustomerId?: number) {
    this.dataLoading = true;
    this.service.getEmployeeList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.EmployeeList = response.EmployeeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }


  removeData(list: any[], index: number) {
    list.splice(index, 1);
    this.calculateTotal();
  }

  //Sell Product
  SellProductList: any[] = [];
  ProductStockList: any[] = [];
  CustomerList: any[] = [];
  SellProduct: any = {};
  GSTList: any[] = [];
  isProductSubmitted: boolean = false;

  resetSellProduct() {
    this.SellProduct = {};
   
    this.SellProduct.MRP = null;
    this.SellProduct.GSTPercentage = 0;
    this.SellProduct.UnitName = null;
    this.isProductSubmitted = false;
  }

  getGSTList() {
    this.dataLoading = true;
    this.service.getGSTList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.GSTList = response.GSTList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  afterStockCodeSelected(item: any) {
    //Check Product is already added
    for (let i = 0; i < this.SellProductList.length; i++) {
      const e1 = this.SellProductList[i];
      if (e1.ProductStockId == item.ProductStockId) {
        e1.Quantity += 1;
        this.changeSellingPrice(e1);
        //toastr.error("This product is already added");
        this.resetSellProduct();
        return;
      }
    }
    this.SellProduct.ProductStockId = item.ProductStockId;
    this.SellProduct.ProductName = item.ProductName;
    this.SellProduct.HSNCode = item.HSNCode;
    this.SellProduct.DesignNo = item.DesignNo;
    this.SellProduct.StockCode = item.StockCode;
    this.SellProduct.SearchProduct = item.SearchProduct;
    this.SellProduct.UnitName = item.UnitName;
    this.SellProduct.MRP = item.MRP;
    this.SellProduct.SellingPrice = item.SellingPrice;
    this.SellProduct.ShopId = item.ShopId;
    this.SellProduct.CategoryName = item.CategoryName;
    this.SellProduct.AvailableQuantity = item.Quantity;
    this.SellProduct.ItemType = item.ItemType;
    if (this.SellProduct.Quantity == null)
      this.SellProduct.Quantity = 1;
    if (item.DiscountPercentage > 0) {
      this.SellProduct.DiscountPercentage = item.DiscountPercentage;
    }
    this.changeSellingPrice(this.SellProduct);
    // const ele = this.formProductElement.nativeElement['Quantity'];
    // if (ele)
    //   ele.focus();
  }


getCustomerList() {
    var obj = {
      Status: 1,
      
    }
    this.service.getCustomerList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.CustomerList = response.CustomerList;
        console.log(this.CustomerList);
        
        this.CustomerList.map(c1 => c1.SearchCustomer = `${c1.MobileNo}`)
      } else {
        toastr.error(response.Message);
      }
      this.loadingProductStock = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.loadingProductStock = false;
    }));
  }

  // afterCustomerSelected(item: any) {
  //   console.log(item);
    
  //   this.Sell.CustomerId = item.CustomerId;
  //   this.Sell.CustomerName = item.CustomerName;
  //   this.Sell.GSTNo = item.GSTNo;
  // }

  //  clearCustomer() {
  //   this.Sell.CustomerId = 0;
  //    this.Sell.CustomerName = "";
  //    this.Sell.GSTNo = "";
  // }



  loadingProductStock: boolean = false;
  loadingCustomer: boolean = false;
  getProductStockDetailList() {
    var obj = {
      Status: 1,
      //ShopId: this.Sell.ShopId
    }
    this.service.getProductStockDetailList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockList = response.ProductStockList;
        this.ProductStockList.map(c1 => c1.SearchProduct = `${c1.StockCode} - ${c1.ProductName} - ${c1.DesignNo}`)
      } else {
        toastr.error(response.Message);
      }
      this.loadingProductStock = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.loadingProductStock = false;
    }));
  }


  //   changeCustomerInput(event: any, form: NgForm) {
  //   var pro = this.CustomerList.filter(x1 => x1.CustomerId == event);
  //   this.Sell.MobileNo = event;
  //   if (pro.length > 0) {
  //     this.afterCustomerSelected(pro[0]);
  //     console.log(this.afterCustomerSelected);
      
  //     return;
  //   }
  // }

  changeProductInput(event: any, form: NgForm) {
    var pro = this.ProductStockList.filter(x1 => x1.StockCode == event);
    if (pro.length > 0) {
      this.afterProductStockSelected(pro[0]);
      // this.addSellProduct(form, 1);
      return;
    }
  }

  afterProductStockSelected(item: any) {
    //Check Product is already added
    for (let i = 0; i < this.SellProductList.length; i++) {
      const e1 = this.SellProductList[i];
      if (e1.ProductStockId == item.ProductStockId) {
        e1.Quantity += 1;
        this.changeSellingPrice(e1);
        //toastr.error("This product is already added");
        this.resetSellProduct();
        return;
      }
    }
    this.SellProduct.ProductStockId = item.ProductStockId;
    this.SellProduct.ProductName = item.ProductName;
    this.SellProduct.HSNCode = item.HSNCode;
    this.SellProduct.StockCode = item.StockCode;
    this.SellProduct.SearchProduct = item.SearchProduct;
    this.SellProduct.UnitName = item.UnitName;
    this.SellProduct.MRP = item.MRP;
    this.SellProduct.SellingPrice = item.SellingPrice;
    this.SellProduct.ShopId = item.ShopId;
    this.SellProduct.CategoryName = item.CategoryName;
    this.SellProduct.AvailableQuantity = item.Quantity;
    this.SellProduct.ItemType = item.ItemType;
    if (this.SellProduct.Quantity == null)
      this.SellProduct.Quantity = 1;
    if (item.DiscountPercentage > 0) {
      this.SellProduct.DiscountPercentage = item.DiscountPercentage;
    }
    this.changeSellingPrice(this.SellProduct);
    // const ele = this.formProductElement.nativeElement['Quantity'];
    // if (ele)
    //   ele.focus();
  }

  clearProductStock() {
    this.SellProduct.ProductId = 0;
    this.resetSellProduct();
  }

  changeSellingPrice(SellProduct: any) {
    if (SellProduct.AvailableQuantity == 0) {
      toastr.error("No stock is available !!");
      SellProduct.Quantity = 0;
    }
    if (SellProduct.AvailableQuantity < SellProduct.Quantity) {
      toastr.error("Quantity should not be more than " + SellProduct.AvailableQuantity);
      SellProduct.Quantity = 0;
    }
    if (SellProduct.Quantity == 0) {
      toastr.error("Quantity should not be zero. Please delete this item. !!");
    }
    if (SellProduct.Quantity > 0) {
      SellProduct.BasicAmount = this.loadDataService.round((SellProduct.Quantity * SellProduct.SellingPrice), 2);
      SellProduct.DiscountAmount = (SellProduct.DiscountAmount == null ? 0 : SellProduct.DiscountAmount);
      if (SellProduct.DiscountPercentage != null) {
        SellProduct.DiscountPercentage = SellProduct.DiscountPercentage;
        SellProduct.DiscountAmount = this.loadDataService.round(SellProduct.BasicAmount * SellProduct.DiscountPercentage / 100, 2);
      }
      SellProduct.GrossAmount = this.loadDataService.round(SellProduct.BasicAmount - SellProduct.DiscountAmount, 0);
      var netAmount: number = this.loadDataService.round(SellProduct.GrossAmount / SellProduct.Quantity, 0);
      if (SellProduct.ItemType == 1) {
        if (netAmount < 1000)
          SellProduct.GSTPercentage = 5;
        else
          SellProduct.GSTPercentage = 12;
      }
      else {
        SellProduct.GSTPercentage = 5;
      }

      this.calculateGST(SellProduct);
    }
  };

  // calculateGST(SellProduct: any) {
  //   SellProduct.TotalGSTAmount = 0;
  //   SellProduct.CGSTAmount = 0;
  //   SellProduct.SGSTAmount = 0;
  //   SellProduct.IGSTAmount = 0;
  //   SellProduct.TaxableAmount = 0;

  //   if (SellProduct.GSTPercentage > 0) {
  //     SellProduct.TaxableAmount = this.loadDataService.round((SellProduct.GrossAmount * (100 / (100 + parseFloat(SellProduct.GSTPercentage)))), 2);
  //     SellProduct.TotalGSTAmount = SellProduct.GrossAmount - SellProduct.TaxableAmount;
  //     //SellProduct.TotalGSTAmount = this.loadDataService.round((SellProduct.GrossAmount - (SellProduct.GrossAmount * (100 / (100 + parseFloat(SellProduct.GSTPercentage))))),2);
  //     //SellProduct.TaxableAmount = this.loadDataService.round((SellProduct.GrossAmount - SellProduct.TotalGSTAmount),2);
  //     //if (gstCode == 20) {
  //     SellProduct.CGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount / 2, 2);
  //     SellProduct.SGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount / 2, 2);
  //     // } else {
  //     //SellProduct.IGSTAmount = SellProduct.TotalGSTAmount;
  //     //}
  //   }
  //   else {
  //     SellProduct.TaxableAmount = SellProduct.GrossAmount;
  //   }
  //   SellProduct.TotalGSTAmount = SellProduct.CGSTAmount + SellProduct.SGSTAmount + SellProduct.IGSTAmount;
  //   //SellProduct.GrossAmount = this.loadDataService.round(SellProduct.TaxableAmount + SellProduct.TotalGSTAmount, 2);
  //   this.calculateTotal();
  // }



  calculateGST(SellProduct: any) {
  SellProduct.TotalGSTAmount = 0;
  SellProduct.CGSTAmount = 0;
  SellProduct.SGSTAmount = 0;
  SellProduct.IGSTAmount = 0;
  SellProduct.TaxableAmount = 0;

  if (SellProduct.GSTPercentage > 0) {
    SellProduct.TaxableAmount = this.loadDataService.round((SellProduct.GrossAmount * (100 / (100 + parseFloat(SellProduct.GSTPercentage)))), 2);
    SellProduct.TotalGSTAmount = SellProduct.GrossAmount - SellProduct.TaxableAmount;
    
    // Check GST state code logic
    const gstStateCode = this.getGSTStateCode(this.Sell.GSTNo);
    
    // If GST number starts with 20 or is null/empty, use SGST/CGST (same state)
    // Otherwise use IGST (inter-state)
    if (gstStateCode === '20' || gstStateCode === null) {
      // Same state - split between SGST and CGST
      SellProduct.CGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount / 2, 2);
      SellProduct.SGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount / 2, 2);
      SellProduct.IGSTAmount = 0;
    } else {
      // Different state - use IGST
      SellProduct.CGSTAmount = 0;
      SellProduct.SGSTAmount = 0;
      SellProduct.IGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount, 2);
    }
  } else {
    SellProduct.TaxableAmount = SellProduct.GrossAmount;
  }
  
  // Recalculate total GST amount to ensure accuracy
  SellProduct.TotalGSTAmount = SellProduct.CGSTAmount + SellProduct.SGSTAmount + SellProduct.IGSTAmount;
  this.calculateTotal();
}

// Helper method to extract GST state code
getGSTStateCode(gstNo: string): string | null {
  if (!gstNo || gstNo.trim() === '') {
    return null;
  }
  
  // GST number format: XXYYYYYYYYYY where XX is state code
  if (gstNo.length >= 2) {
    return gstNo.substring(0, 2);
  }
  
  return null;
}

// You'll also need to update the afterCustomerSelected method to trigger GST recalculation
// afterCustomerSelected(item: any) {
//   console.log(item);
  
//   this.Sell.CustomerId = item.CustomerId;
//   this.Sell.CustomerName = item.CustomerName;
//   this.Sell.GSTNo = item.GSTNo;
  
//   // Recalculate GST for all products when customer GST changes
//   this.recalculateAllProductsGST();
// }

// Method to recalculate GST for all products when GST number changes
recalculateAllProductsGST() {
  this.SellProductList.forEach(product => {
    this.calculateGST(product);
  });
}

// Update the GSTNo input change event (add this to your template)
onGSTNoChange() {
  // Recalculate GST for all products when GST number is manually changed
  this.recalculateAllProductsGST();
}

  changeDiscountAmount(SellProduct: any) {
    if (SellProduct.ItemType == 1) {
      SellProduct.DiscountPercentage = SellProduct.DiscountAmount * 100 / SellProduct.BasicAmount;
      SellProduct.GrossAmount = this.loadDataService.round(SellProduct.BasicAmount - SellProduct.DiscountAmount, 2);
      var netAmount: number = this.loadDataService.round(SellProduct.GrossAmount / SellProduct.Quantity, 2);
      if (netAmount < 1000)
        SellProduct.GSTPercentage = 5;
      else
        SellProduct.GSTPercentage = 12;
    }
    else {
      SellProduct.DiscountPercentage = SellProduct.DiscountAmount * 100 / SellProduct.BasicAmount;
      SellProduct.GrossAmount = this.loadDataService.round(SellProduct.BasicAmount - SellProduct.DiscountAmount, 2);
      var netAmount: number = this.loadDataService.round(SellProduct.GrossAmount / SellProduct.Quantity, 2);
      SellProduct.GSTPercentage = 5;
    }
    this.calculateGST(SellProduct);
  }

  addSellProduct(form: NgForm, isCheck?: number) {
    this.isProductSubmitted = true;
    if (form.invalid && isCheck != 1) {
      //toastr.warning("Fill all the Required Fields.", "Invailid Form")
      return;
    }

    if (this.SellProduct.ProductStockId == null) {
      toastr.warning("Selected Product is invalid.");
      this.dataLoading = false;
      return;
    }



    var obj = {
      ProductStockId: this.SellProduct.ProductStockId,
      SearchProduct: this.SellProduct.SearchProduct,
      ProductName: this.SellProduct.ProductName,
      StockCode: this.SellProduct.StockCode,
      HSNCode: this.SellProduct.HSNCode,
      UnitName: this.SellProduct.UnitName,
      MRP: this.SellProduct.MRP,
      SellingPrice: this.SellProduct.SellingPrice,
      Quantity: this.SellProduct.Quantity,
      TotalAmount: this.SellProduct.TotalAmount,
      BasicAmount: this.SellProduct.BasicAmount,
      DiscountPercentage: this.SellProduct.DiscountPercentage,
      DiscountAmount: this.SellProduct.DiscountAmount,
      TaxableAmount: this.SellProduct.TaxableAmount,
      GSTPercentage: this.SellProduct.GSTPercentage,
      CGSTAmount: this.SellProduct.CGSTAmount,
      SGSTAmount: this.SellProduct.SGSTAmount,
      IGSTAmount: this.SellProduct.IGSTAmount,
      GrossAmount: this.SellProduct.GrossAmount,
      ShopId: this.SellProduct.ShopId,
      CategoryName: this.SellProduct.CategoryName
    }
    this.SellProductList.push(obj);

    this.resetSellProduct();
    form.control.markAsUntouched();
    form.control.markAsUntouched();
    this.calculateTotal();
    const ele = this.formProductElement.nativeElement[0];
    if (ele)
      ele.focus();
  }

  //Sell
  @ViewChild('myFormElement') myFormElement: ElementRef;
  @ViewChild('formProductElement') formProductElement: ElementRef;

  calculateTotal() {
    this.Sell.TotalAmount = 0;
    this.Sell.DiscountAmount = 0;
    this.Sell.TaxableAmount = 0;
    this.Sell.CGSTAmount = 0;
    this.Sell.SGSTAmount = 0;
    this.Sell.IGSTAmount = 0;
    this.Sell.NetAmount = 0;
    this.Sell.RoundOff = 0;
    this.Sell.GrandTotal = 0;
    this.Sell.DuesAmount = 0;
    this.TotalSellProduct.TotalQuantity = 0;

    this.SellProductList.forEach((e1: any) => {
      this.Sell.TotalAmount += e1.BasicAmount;
      this.Sell.DiscountAmount += e1.DiscountAmount;
      this.Sell.TaxableAmount += e1.TaxableAmount;
      this.Sell.CGSTAmount += e1.CGSTAmount;
      this.Sell.SGSTAmount += e1.SGSTAmount;
      this.Sell.IGSTAmount += e1.IGSTAmount;
      this.Sell.NetAmount += e1.GrossAmount;
      this.TotalSellProduct.TotalQuantity += e1.Quantity;
    });
    this.Sell.TotalAmount = this.loadDataService.round(this.Sell.TotalAmount, 2);
    this.Sell.DiscountAmount = this.loadDataService.round(this.Sell.DiscountAmount, 2);
    this.Sell.CGSTAmount = this.loadDataService.round(this.Sell.CGSTAmount, 2);
    this.Sell.SGSTAmount = this.loadDataService.round(this.Sell.SGSTAmount, 2);
    this.Sell.IGSTAmount = this.loadDataService.round(this.Sell.IGSTAmount, 2);
    this.Sell.TaxableAmount = this.loadDataService.round(this.Sell.TaxableAmount, 2);
    this.Sell.NetAmount = this.loadDataService.round(this.Sell.NetAmount, 2);
    this.Sell.GrandTotal = this.loadDataService.round(this.Sell.NetAmount);
    this.Sell.RoundOff = this.loadDataService.round(this.Sell.GrandTotal - this.Sell.NetAmount, 2);
  }

  changeGrandTotal() {
    this.Sell.DuesAmount = this.loadDataService.round(this.Sell.NetAmount) - this.Sell.GrandTotal;
  }

  keyPress(event: any) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      if (event.currentTarget.name == 'MobileNo') {
        const ele = this.formProductElement.nativeElement[0];
        if (ele)
          ele.focus();
      } else if (event.currentTarget.name == 'Quantity') {
        const ele = this.formProductElement.nativeElement['addProduct'];
        if (ele)
          ele.focus();
      }
    }
  }

  submit(event: any, form: NgForm, form2: NgForm) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '43') {
      this.saveSell(form, form2);
    }
  }


  resetForm() {
    this.Sell = {};
    this.Sell.SellId = 0;
    this.Sell.Status = "1";
    this.Sell.CustomerId = "";
    // this.Sell.CustomerName = "Cash";
    this.Sell.EmployeeId = this.employeeDetail.EmployeeId;
    this.Sell.InvoiceDate = this.loadDataService.loadDateYMDT(new Date());
    this.submitted = false;
    this.SellProductList = [];
    // this.ProductStockList =[];
    $('#MobileNo').focus();
    $('#MobileNo').keypress(function (event: any) {
    });
  }
  
  saveSell(form: NgForm, form2: NgForm) {
    console.log(this.Sell);
    
    this.submitted = true;
    if (form.invalid || form2.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    if (this.SellProductList.length == 0) {
      toastr.warning("No Product is selected", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    for (let i = 0; i < this.SellProductList.length; i++) {
      const e1 = this.SellProductList[i];
      if (e1.Quantity <= 0) {
        toastr.error("Invailid Quantity!!", e1.StockCode + " " + e1.ProductName)
        this.dataLoading = false;
        return;
      }
    }

        if (!this.validateCustomerMobileOnNameFocus()) {
      toastr.warning("Please resolve the customer mobile number issue.", "Invalid Customer");
      this.dataLoading = false;
      return;
    }

    if (form.invalid || form2.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invalid Form");
      this.dataLoading = false;
      return;
    }


    // if(!this.Sell.CustumerId){
    //   this.Sell.MobileNo = this.Sell.CustomerAutoComplete;

    // }
    var obj = {

      Sell: this.Sell,
      SellProductList: this.SellProductList,
      EmployeeId: this.employeeDetail.EmployeeId,
      GSTNo: this.Sell.GSTNo
    }
    
    this.dataLoading = true;
    this.service.saveSell(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.getCustomerList();
        this.service.printSellInvoice(response.SellId);
        if (this.redUrl)
          this.router.navigate([this.redUrl]);
        // form2.reset();
        // form.reset();
        var empId = this.Sell.EmployeeId;
        this.resetForm();
        this.Sell.EmployeeId = empId;
        this.resetSellProduct();
        form.control.markAsPristine();
        form.control.markAsUntouched();
        form2.control.markAsPristine();
        form2.control.markAsUntouched();
        //this.Sell.ShopId = 1;
        // if (this.Sell.ShopId > 0)
        //   this.getProductStockDetailList();
        // this.getProductStockDetailList();
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }
}

