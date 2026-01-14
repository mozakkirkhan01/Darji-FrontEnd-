import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-goods-return',
  templateUrl: './goods-return.component.html',
  styleUrls: ['./goods-return.component.css']
})
export class GoodsReturnComponent implements OnInit {

  Sell: any = {};
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  CustomerList: any = [];
  SelectedCustomer: any = {};
  ShopList: any = [];
  TotalSellProduct: any = {};
  ProductStockDetailForReturn: any[] = [];
  AllProductStockDetailForReturn: any[] = [];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  redUrl: string;
  ngOnInit(): void {
    this.loadingProductStock = true;
    //this.getPurchaseList();
    //this.getProductStockDetailForReturn();
    this.getProductStockDetailList();
    this.setupSearchListener();
    this.getGSTList();
    this.getEmployeeList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetSellProduct();
    this.resetForm();
    this.getShopList();
    this.TotalSellProduct.TotalQuantity = 0;
  }

  private searchSubject = new Subject<string>();
  // Initialize search listener with debouncing
  setupSearchListener() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm: string) => {
      this.performFilterss(searchTerm);
    });
  }

  // Optimized API call to load product stock details
  getProductStockDetailList() {
    this.loadingProductStock = true;
    const obj = {};

    this.service.getProductStockDetailForReturn(obj).subscribe(
      (response: any) => {
        if (response.Message === 'Success') {
          this.AllProductStockDetailForReturn = response.ProductStockDetailForReturn.map((x: any) => ({
            ...x,
            SearchProduct: `${x.StockCode} - ${x.ProductName} - ${x.SizeName} - ${x.HSNCode}`,
          }));
          this.ProductStockDetailForReturn = [...this.AllProductStockDetailForReturn];
        } else {
          toastr.error(response.Message);
        }
        this.loadingProductStock = false;
      },
      () => {
        toastr.error('Error occurred while fetching data.');
        this.loadingProductStock = false;
      }
    );
  }

  // getFilterProductStockDetailList(ProductStockId: number) {
  //   this.loadingProductStock = true;
  //   const obj = { ProductStockId };

  //   this.service.getFilterProductStockDetailList(obj).subscribe(
  //     (response: any) => {
  //       if (response.Message === 'Success') {
  //         this.AllselectedProduct = response.FilterProductStockDetailList;

  //         const selectedProduct = this.AllselectedProduct[0];

  //         if (!selectedProduct) return;

  //         const existingProduct = this.SellProductList?.find(
  //           (product) => product.ProductStockId === selectedProduct.ProductStockId
  //         );

  //         if (existingProduct) {
  //           existingProduct.Quantity += 1;
  //           this.changeSellingPrice(existingProduct);
  //         } else {
  //           this.SellProduct = {
  //             ...selectedProduct,
  //             Quantity: 1, 
  //             DiscountPercentage: selectedProduct.DiscountPercentage || 0, 
  //           };

  //           this.changeSellingPrice(this.SellProduct);

  //           this.addSellProduct(1);

  //         }
  //       } else {
  //         toastr.error(response.Message);
  //         (response.Message);
  //       }
  //       this.loadingProductStock = false;
  //     },
  //     (error) => {
  //       toastr.error('Error occurred while fetching data.');
  //       this.loadingProductStock = false;
  //       (error);
  //     }
  //   );
  // }


  filterPatientList(value: string) {
    this.searchSubject.next(value);
  }

  performFilterss(searchTerm: string) {
    if (!searchTerm) {
      this.ProductStockDetailForReturn = [...this.AllProductStockDetailForReturn];
      return;
    }
    const filterValue = searchTerm;
    var pro = this.ProductStockDetailForReturn.filter(x1 => x1.StockCode == filterValue);
    if (pro.length > 0) {
      this.afterPatientSelected(pro[0]);
    } else if (filterValue.length > 3) {
      this.ProductStockDetailForReturn = [];
      for (let i = 0; i < this.AllProductStockDetailForReturn.length; i++) {
        const e1 = this.AllProductStockDetailForReturn[i];
        if (e1.SearchProduct.includes(filterValue))
          this.ProductStockDetailForReturn.push(e1)
      }
    }


  }

  clearPatient() {
    this.ProductStockDetailForReturn = [...this.AllProductStockDetailForReturn];
    this.SellProduct = { ProductStockId: null, ProductName: '' };
  }

  AllselectedProduct: any[] = [];
  afterPatientSelected(event: any) {
    try {
      this.afterPatientSelected(event.option.id);
      this.AllselectedProduct = this.ProductStockDetailForReturn.filter(x1 => x1.ProductStockId == event.option.id);
      const item = this.AllselectedProduct[0];


      this.SellProduct.ProductStockId = item.ProductStockId;
      this.SellProduct.ProductId = item.ProductId;
      this.SellProduct.ProductName = item.ProductName;
      this.SellProduct.HSNCode = item.HSNCode;
      this.SellProduct.StockCode = item.StockCode;
      this.SellProduct.SearchProduct = item.SearchProduct;
      this.SellProduct.UnitName = item.UnitName;
      this.SellProduct.MRP = item.MRP;
      this.SellProduct.Rate = item.CostPrice;
      // this.SellProduct.CostPrice = item.CostPrice;
      this.SellProduct.ShopId = item.ShopId;
      this.SellProduct.CategoryName = item.CategoryName;
      this.SellProduct.AvailableQuantity = item.Quantity;
      this.SellProduct.Rate = item.CostPrice;
      this.SellProduct.PurchaseQuantity = item.PurchaseQuantity;
      //this.SellProduct.TaxableAmount = item.TaxableAmount;
      this.SellProduct.SupplierId = item.SupplierId;
      this.SellProduct.SupplierName = item.SupplierName;
      this.SellProduct.GSTPercentage = item.GSTPercentage;
      this.SellProduct.InvoiceNo = item.InvoiceNo;
      this.SellProduct.CompanyName = item.CompanyName;
      this.SellProduct.DiscountPercentage = item.PurchaseDiscountPercentage;
      this.SellProduct.CostPrice = this.loadDataService.round((this.SellProduct.Rate * ((100 - item.PurchaseDiscountPercentage) / 100)), 2);

      this.SellProduct.IGST = item.IGSTAmount;

    } catch (error) {
      console.error('Error during product selection:', error);
    }
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
  PurchaseProductList: any[] = [];
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

  loadingProductStock: boolean = false;
  getProductStockDetailForReturn() {
    var obj = {
      Status: 1,
      //ShopId: this.Sell.ShopId
    }
    this.service.getProductStockDetailForReturn(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockDetailForReturn = response.ProductStockDetailForReturn;
        this.ProductStockDetailForReturn.map(c1 => c1.SearchProduct = `${c1.StockCode} - ${c1.ProductName} - ${c1.SizeName} - ${c1.HSNCode}`)
      } else {
        toastr.error(response.Message);
      }
      this.loadingProductStock = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.loadingProductStock = false;
    }));
  }

  changeProductInput(event: any, form: NgForm) {
    var pro = this.ProductStockDetailForReturn.filter(x1 => x1.StockCode == event);
    if (pro.length > 0) {
      this.afterProductStockSelected(pro[0]);
      this.addSellProduct(form, 1);
      return;
    }
  }

  afterProductStockSelected(item: any) {
    //Check Product is already added
    // for (let i = 0; i < this.SellProductList.length; i++) {
    //   const e1 = this.SellProductList[i];
    //   if (e1.ProductStockId == item.ProductStockId) {
    //     e1.Quantity += 1;
    //this.changeSellingPrice(e1);
    //toastr.error("This product is already added");
    //     this.resetSellProduct();
    //     return;
    //   }
    // }

    this.SellProduct.ProductStockId = item.ProductStockId;
    this.SellProduct.ProductId = item.ProductId;
    this.SellProduct.ProductName = item.ProductName;
    this.SellProduct.HSNCode = item.HSNCode;
    this.SellProduct.StockCode = item.StockCode;
    this.SellProduct.SearchProduct = item.SearchProduct;
    this.SellProduct.UnitName = item.UnitName;
    this.SellProduct.MRP = item.MRP;
    this.SellProduct.Rate = item.CostPrice;
    // this.SellProduct.CostPrice = item.CostPrice;
    this.SellProduct.ShopId = item.ShopId;
    this.SellProduct.CategoryName = item.CategoryName;
    this.SellProduct.AvailableQuantity = item.Quantity;
    this.SellProduct.Rate = item.CostPrice;
    this.SellProduct.PurchaseQuantity = item.PurchaseQuantity;
    //this.SellProduct.TaxableAmount = item.TaxableAmount;
    this.SellProduct.SupplierId = item.SupplierId;
    this.SellProduct.SupplierName = item.SupplierName;
    this.SellProduct.GSTPercentage = item.GSTPercentage;
    this.SellProduct.InvoiceNo = item.InvoiceNo;
    this.SellProduct.CompanyName = item.CompanyName;
    this.SellProduct.DiscountPercentage = item.PurchaseDiscountPercentage;
    this.SellProduct.CostPrice = this.loadDataService.round((this.SellProduct.Rate * ((100 - item.PurchaseDiscountPercentage) / 100)), 2);

    this.SellProduct.IGST = item.IGSTAmount;
    // this.SellProduct.GrossAmount = item.GrossAmount;
    // this.SellProduct.GSTPercentage = item.GSTPercentage;
    // this.SellProduct.InvoiceNo = item.InvoiceNo;

  }

  changeCostPrice() {
    this.SellProduct.BasicAmount = 0;
    this.SellProduct.TaxableAmount = 0;
    this.SellProduct.TotalGSTAmount = 0;

    this.SellProduct.GrossAmount = 0;
    // if (this.SellProduct.DiscountPercentage > 0) {
    //   this.SellProduct.BasicAmount = this.loadDataService.round((this.SellProduct.CostPrice * this.SellProduct.Quantity), 2);
    // }
    // else {
    this.SellProduct.BasicAmount = this.loadDataService.round((this.SellProduct.CostPrice * this.SellProduct.Quantity), 2);
    // }
    this.SellProduct.TaxableAmount = this.SellProduct.BasicAmount;
    this.SellProduct.TotalGSTAmount = this.loadDataService.round((this.SellProduct.TaxableAmount * this.SellProduct.GSTPercentage) / 100, 2);
    if (this.SellProduct.IGST > 0) {
      this.SellProduct.IGSTAmount = 0;
      this.SellProduct.CGSTAmount = 0;
      this.SellProduct.SGSTAmount = 0;
      this.SellProduct.IGSTAmount = this.SellProduct.TotalGSTAmount;
    } else {
      this.SellProduct.IGSTAmount = 0;
      this.SellProduct.CGSTAmount = 0;
      this.SellProduct.SGSTAmount = 0;
      this.SellProduct.CGSTAmount = this.loadDataService.round(this.SellProduct.TotalGSTAmount / 2, 2);
      this.SellProduct.SGSTAmount = this.loadDataService.round(this.SellProduct.TotalGSTAmount / 2, 2);
    }

    this.SellProduct.TotalGSTAmount = this.SellProduct.CGSTAmount + this.SellProduct.SGSTAmount + this.SellProduct.IGSTAmount;
    this.SellProduct.GrossAmount = this.loadDataService.round(this.SellProduct.TaxableAmount + this.SellProduct.TotalGSTAmount, 2);
  }

  clearProductStock() {
    this.SellProduct.ProductId = 0;
    //this.resetSellProduct();
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

    }
  };

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

    if (this.SellProduct.Quantity == null) {
      toastr.warning("Please select quantity.");
      this.dataLoading = false;
      return;
    }



    var obj = {
      ProductStockId: this.SellProduct.ProductStockId,
      SearchProduct: this.SellProduct.SearchProduct,
      ProductId: this.SellProduct.ProductId,
      ProductName: this.SellProduct.ProductName,
      StockCode: this.SellProduct.StockCode,
      HSNCode: this.SellProduct.HSNCode,
      UnitName: this.SellProduct.UnitName,
      MRP: this.SellProduct.MRP,
      Rate: this.SellProduct.Rate,
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
      CostPrice: this.SellProduct.CostPrice,
      InvoiceNo: this.SellProduct.InvoiceNo,
      CompanyName: this.SellProduct.CompanyName,
      SupplierId: this.SellProduct.SupplierId,
      SupplierName: this.SellProduct.SupplierName,
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

  submit(event: any) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '43') {
      this.saveGoodsReturn();
    }
  }


  resetForm() {
    this.Sell = {};
    this.Sell.SellId = 0;
    this.Sell.Status = "1";
    this.Sell.CustomerId = "";
    this.Sell.CustomerName = "Cash";
    this.Sell.EmployeeId = this.employeeDetail.EmployeeId;
    this.Sell.InvoiceDate = this.loadDataService.loadDateYMDT(new Date());
    this.submitted = false;
    this.SellProductList = [];
    // this.ProductStockDetailForReturn =[];
    $('#MobileNo').focus();
    $('#MobileNo').keypress(function (event: any) {
    });
  }

  saveGoodsReturn() {
    this.submitted = true;

    var obj = {
      goods: this.SellProductList,
      EmployeeId: this.employeeDetail.EmployeeId
    }
    this.dataLoading = true;
    this.service.saveGoodsReturn(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        //this.service.printSellInvoice(response.SellId);
        if (this.redUrl)
          this.router.navigate([this.redUrl]);
        // form2.reset();
        // form.reset();
        var empId = this.Sell.EmployeeId;
        this.resetForm();
        this.Sell.EmployeeId = empId;
        this.resetSellProduct();
        //this.Sell.ShopId = 1;
        // if (this.Sell.ShopId > 0)
        //   this.getProductStockDetailForReturn();
        // this.getProductStockDetailForReturn();
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
