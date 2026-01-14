import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormControl, Validators } from "@angular/forms";
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
  selector: 'app-merge-sellproduct',
  templateUrl: './merge-sellproduct.component.html',
  styleUrls: ['./merge-sellproduct.component.css']
})
export class MergeSellproductComponent implements OnInit {

  Sell: any = {};
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  CustomerList: any = [];
  SelectedCustomer: any = {};
  ShopList: any = [];
  TotalSellProduct: any = {};


  productControl = new FormControl('', Validators.required);
  filteredProductList: any[] = [];
  loadingProductStock = false;
  // SellProduct: any = {
  //   ProductStockId: null,
  //   AvailableQuantity: null,
  //   UnitName: null,
  // };
  isProductSubmitted = false;

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
    this.getProductStockDetailList();
    this.setupSearchListener();

    this.getGSTList();
    this.getEmployeeList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetSellProduct();
    this.resetForm();
    this.getShopList();
    this.TotalSellProduct.TotalQuantity = 0;
    this.route.queryParams.subscribe((params: any) => {
      this.Sell.SellId = params.id;
      this.redUrl = params.redUrl;
      if (this.Sell.SellId > 0)
        this.getSellDetail(this.Sell.SellId);
      else
        this.Sell.SellId = 0;
    });
  }

  onProductInput(event: any): void {
    const inputValue = (event.target as HTMLInputElement).value;
    // Input event logic (if any additional logic is required)
  }

  onProductSelected(product: any): void {
    this.SellProduct.ProductStockId = product.ProductStockId;
    this.SellProduct.AvailableQuantity = product.Quantity;
    this.SellProduct.UnitName = product.UnitName;
    // Handle additional fields and logic for the selected product
  }

  filterProducts(inputValue: string) {
    return this.ProductStockList.filter(product =>
      product.SearchProduct.includes(inputValue)
    );
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
        this.Sell.CustomerAutoCompleter = this.Sell.CustomerId;
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
  //ProductStockList: any[] = [];
  SellProduct: any = {};
  GSTList: any[] = [];
  //isProductSubmitted: boolean = false;

  resetSellProduct() {
    this.SellProduct = {};
    this.SellProduct.ProductName = null;
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

  AllselectedProduct: any[] = [];
  ProductStockList: any[] = [];
  AllProductStockList: any[] = [];
  private searchSubject = new Subject<string>();
  // Initialize search listener with debouncing
  setupSearchListener() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm: string) => {
      this.performFilter(searchTerm);
    });
  }

  // Optimized API call to load product stock details
  getProductStockDetailList() {
    this.loadingProductStock = true;
    const obj = { Status: 1 };

    this.service.getProductStockDetailList(obj).subscribe(
      (response: any) => {
        if (response.Message === 'Success') {
          this.AllProductStockList = response.ProductStockList.map((x: any) => ({
            ...x,
            SearchProduct: `${x.StockCode} - ${x.ProductName} - ${x.SizeName} - ${x.HSNCode}`,
          }));
          this.ProductStockList = [...this.AllProductStockList];
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

  getFilterProductStockDetailList(ProductStockId: number) {
    this.loadingProductStock = true;
    const obj = { ProductStockId };

    this.service.getFilterProductStockDetailList(obj).subscribe(
      (response: any) => {
        if (response.Message === 'Success') {
          this.AllselectedProduct = response.FilterProductStockDetailList;
          //(this.AllselectedProduct);

          // Use the first product from the result
          const selectedProduct = this.AllselectedProduct[0];

          // Exit early if no product is found
          if (!selectedProduct) return;

          // Check if the product already exists in the SellProductList
          const existingProduct = this.SellProductList?.find(
            (product) => product.ProductStockId === selectedProduct.ProductStockId
          );

          if (existingProduct) {
            // Update quantity and price for the existing product
            existingProduct.Quantity += 1;
            this.changeSellingPrice(existingProduct);
            this.resetSellProduct();

          } else {
            // Add new product with default quantity and discount
            this.SellProduct = {
              ...selectedProduct,
              Quantity: 1, // Default quantity
              DiscountPercentage: selectedProduct.DiscountPercentage || 0, // Default discount
            };

            // Update price for the new product
            this.changeSellingPrice(this.SellProduct);

            // Add the product to the SellProductList
            this.addSellProduct(1);

          }
        } else {
          toastr.error(response.Message);
          (response.Message);
        }
        this.loadingProductStock = false;
      },
      (error) => {
        toastr.error('Error occurred while fetching data.');
        this.loadingProductStock = false;
        (error);
      }
    );
  }


  filterPatientList(value: string) {
    this.searchSubject.next(value);
  }

  performFilter(searchTerm: string) {
    if (!searchTerm) {
      this.ProductStockList = [...this.AllProductStockList];
      return;
    }
    const filterValue = searchTerm;
    var pro = this.ProductStockList.filter(x1 => x1.StockCode == filterValue);
    if (pro.length > 0) {
      this.getFilterProductStockDetailList(pro[0].ProductStockId);
    } else if (filterValue.length > 3) {
      this.ProductStockList = [];
      for (let i = 0; i < this.AllProductStockList.length; i++) {
        const e1 = this.AllProductStockList[i];
        if (e1.SearchProduct.includes(filterValue))
          this.ProductStockList.push(e1)
      }
      // this.ProductStockList = this.AllProductStockList.filter((option) =>
      //   option.SearchProduct.includes(filterValue)
      // );
    }


  }

  // Clear search and reset product stock list
  clearPatient() {
    this.ProductStockList = [...this.AllProductStockList];
    this.SellProduct = { ProductStockId: null, ProductName: '' };
  }

  afterPatientSelected(event: any) {
    try {
      // Wait for the product data to be fetched
      this.getFilterProductStockDetailList(event.option.id);

      // Use the first product from the result
      //const selectedProduct = this.AllselectedProduct[0];

      // Exit early if no product is found
      //if (!selectedProduct) return;

      // Check if the product already exists in the SellProductList
      // const existingProduct = this.SellProductList?.find(
      //   (product) => product.ProductStockId === selectedProduct.ProductStockId
      // );

      // if (existingProduct) {
      //   existingProduct.Quantity += 1;
      //   this.changeSellingPrice(existingProduct);
      // } else {
      //   this.SellProduct = {
      //     ...selectedProduct,
      //     Quantity: 1, 
      //     DiscountPercentage: selectedProduct.DiscountPercentage || 0, 
      //   };

      //   this.changeSellingPrice(this.SellProduct);

      // }

    } catch (error) {
      console.error('Error during product selection:', error);
    }
  }

  barcode: string = ''; // To store the scanned barcode

  onBarcodeScan(event: KeyboardEvent): void {
    // Capture the input value
    const scannedChar = event.key;

    // Check if Enter key is pressed to process the barcode
    if (scannedChar === 'Enter') {
      this.processBarcode(this.barcode);
      this.barcode = ''; // Reset the barcode
    } else {
      // Accumulate characters for the barcode
      this.barcode += scannedChar;
    }
  }

  processBarcode(barcode: string): void {
    // Find the product by barcode
    const selectedProduct = this.AllProductStockList.find(
      (product) => product.Barcode === barcode
    );

    if (selectedProduct) {
      // Set the product name and details in the text box
      this.SellProduct.ProductName = selectedProduct.ProductName;
      this.afterPatientSelected({ option: { id: selectedProduct.ProductStockId } });
    } else {
      console.warn('Product not found for scanned barcode:', barcode);
    }
  }

  // Handle selection of a product
  // afterPatientSelected(event: any) {
  //   const selectedProduct = this.ProductStockList.find(
  //     (product) => product.ProductStockId === event.option.id
  //   );

  //   if (!selectedProduct) return;

  //   Check if the product is already added
  //   const existingProduct = this.SellProductList.find(
  //     (product) => product.ProductStockId === selectedProduct.ProductStockId
  //   );

  //   if (existingProduct) {
  //     existingProduct.Quantity += 1;
  //     this.changeSellingPrice(existingProduct);
  //     this.resetSellProduct();
  //     return;
  //   }

  //   this.SellProduct = {
  //     ...selectedProduct,
  //     Quantity: this.SellProduct.Quantity || 1,
  //     DiscountPercentage: selectedProduct.DiscountPercentage > 0
  //       ? selectedProduct.DiscountPercentage
  //       : 0,
  //   };

  //   this.changeSellingPrice(this.SellProduct);
  // }



  changeProductInput(event: any) {
    var pro = this.ProductStockList.filter(x1 => x1.StockCode == event);
    if (pro.length > 0) {
      this.afterProductStockSelected(pro[0]);
      this.addSellProduct(1);
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

  calculateGST(SellProduct: any) {
    SellProduct.TotalGSTAmount = 0;
    SellProduct.CGSTAmount = 0;
    SellProduct.SGSTAmount = 0;
    SellProduct.IGSTAmount = 0;
    SellProduct.TaxableAmount = 0;

    if (SellProduct.GSTPercentage > 0) {
      SellProduct.TaxableAmount = this.loadDataService.round((SellProduct.GrossAmount * (100 / (100 + parseFloat(SellProduct.GSTPercentage)))), 2);
      SellProduct.TotalGSTAmount = SellProduct.GrossAmount - SellProduct.TaxableAmount;
      //SellProduct.TotalGSTAmount = this.loadDataService.round((SellProduct.GrossAmount - (SellProduct.GrossAmount * (100 / (100 + parseFloat(SellProduct.GSTPercentage))))),2);
      //SellProduct.TaxableAmount = this.loadDataService.round((SellProduct.GrossAmount - SellProduct.TotalGSTAmount),2);
      //if (gstCode == 20) {
      SellProduct.CGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount / 2, 2);
      SellProduct.SGSTAmount = this.loadDataService.round(SellProduct.TotalGSTAmount / 2, 2);
      // } else {
      //SellProduct.IGSTAmount = SellProduct.TotalGSTAmount;
      //}
    }
    else {
      SellProduct.TaxableAmount = SellProduct.GrossAmount;
    }
    SellProduct.TotalGSTAmount = SellProduct.CGSTAmount + SellProduct.SGSTAmount + SellProduct.IGSTAmount;
    //SellProduct.GrossAmount = this.loadDataService.round(SellProduct.TaxableAmount + SellProduct.TotalGSTAmount, 2);
    this.calculateTotal();
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

  @ViewChild('formProduct') formProduct: NgForm;
  addSellProduct(isCheck?: number) {
    this.isProductSubmitted = true;
    if (this.formProduct.invalid && isCheck != 1) {
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
    this.formProduct.control.markAsUntouched();
    this.formProduct.control.markAsUntouched();
    this.calculateTotal();
    const ele = this.formProductElement.nativeElement[0];
    if (ele)
      ele.focus();
    this.clearPatient();
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
    this.Sell.CustomerName = "Cash";
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
    var obj = {
      Sell: this.Sell,
      SellProductList: this.SellProductList,
      EmployeeId: this.employeeDetail.EmployeeId
    }
    this.dataLoading = true;
    this.service.saveSell(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
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
