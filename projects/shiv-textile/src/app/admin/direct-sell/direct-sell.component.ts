import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-direct-sell',
  templateUrl: './direct-sell.component.html',
  styleUrls: ['./direct-sell.component.css']
})
export class DirectSellComponent implements OnInit {
  Sell: any = {};
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  CustomerList: any = [];
  SelectedCustomer: any = {};

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  redUrl: string;
  ngOnInit(): void {
    //this.getProductStockDetailList();
    this.getGSTList();
    this.getEmployeeList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetSellProduct();
    this.resetForm();
   
    this.route.queryParams.subscribe((params: any) => {
      this.Sell.SellId = params.id;
      this.redUrl = params.redUrl;
      if (this.Sell.SellId > 0)
        this.getSellDetail(this.Sell.SellId);
      else
        this.Sell.SellId = 0;
    });
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

  afterCustomerSelected(item: any) {
    this.Sell.CustomerId = item.CustomerId;
    this.SelectedCustomer = item;
  }

  clearCustomer() {
    this.Sell.CustomerId = null;
  }

  removeData(list: any[], index: number) {
    list.splice(index, 1);
    this.calculateTotal();
  }

  //Sell Product
  SellProductList: any[] = [];
  ProductStockList: any[] = [];
  SellProduct: any = {};
  GSTList: any[] = [];
  isProductSubmitted: boolean = false;

  resetSellProduct() {
    this.SellProduct = {};
    this.SellProduct.MRP = null;
    this.SellProduct.GSTPercentage = 5;
    this.SellProduct.UnitName = null;
    this.isProductSubmitted = false;
    this.SellProduct.Quantity = 1;
    this.SellProduct.DiscountPercentage = 10;
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


  getProductStockDetailList() {
    this.dataLoading = true;
    this.service.getProductStockDetailList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockList = response.ProductStockList;
        this.ProductStockList.map(c1 => c1.SearchProduct = `${c1.StockCode} - ${c1.ProductName} - ${c1.SizeName} - ${c1.HSNCode}`)
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  changeProductInput(event: any, form: NgForm) {
    for (let i1 = 0; i1 < this.ProductStockList.length; i1++) {
      const e1 = this.ProductStockList[i1];
      if (e1.StockCode == event) {
        this.afterProductStockSelected(e1);
        this.addSellProduct(form,1);
        break;
      }
    }
  }

  afterProductStockSelected(item: any) {
    //Check Product is already added
    for (let i = 0; i < this.SellProductList.length; i++) {
      const e1 = this.SellProductList[i];
      if (e1.ProductStockId == item.ProductStockId) {
        toastr.error("This product is already added");
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
    this.SellProduct.AvailableQuantity = item.Quantity;
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
    SellProduct.BasicAmount = this.loadDataService.round((SellProduct.Quantity * SellProduct.SellingPrice), 2);
    SellProduct.DiscountAmount = (SellProduct.DiscountAmount == null ? 0 : SellProduct.DiscountAmount);
    if (SellProduct.DiscountPercentage != null) {
      SellProduct.DiscountPercentage = SellProduct.DiscountPercentage;
      SellProduct.DiscountAmount = this.loadDataService.round(SellProduct.BasicAmount * SellProduct.DiscountPercentage / 100, 2);
    }
    SellProduct.GrossAmount = this.loadDataService.round(SellProduct.BasicAmount - SellProduct.DiscountAmount, 0);
    var netAmount: number = this.loadDataService.round(SellProduct.GrossAmount / SellProduct.Quantity, 0);
    //if (netAmount < 1000)
    //SellProduct.GSTPercentage = 5;
    SellProduct.GSTPercentage = SellProduct.GSTPercentage;
    //else
      //SellProduct.GSTPercentage = 12;
    this.calculateGST(SellProduct);
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
    SellProduct.DiscountPercentage = SellProduct.DiscountAmount * 100 / SellProduct.BasicAmount;
    SellProduct.GrossAmount = this.loadDataService.round(SellProduct.BasicAmount - SellProduct.DiscountAmount, 2);
    var netAmount: number = this.loadDataService.round(SellProduct.GrossAmount / SellProduct.Quantity, 2);
    if (netAmount < 1000)
      SellProduct.GSTPercentage = 5;
    else
      SellProduct.GSTPercentage = 12;
    this.calculateGST(SellProduct);
  }

  addSellProduct(form: NgForm,isCheck?:number) {
    this.isProductSubmitted = true;
    if (form.invalid && isCheck != 1) {
      //toastr.warning("Fill all the Required Fields.", "Invailid Form")
      return;
    }

    if (this.SellProduct.ProductName == null) {
      toastr.warning("Selected Product is invalid.");
      this.dataLoading = false;
      return;
    }



    var obj = {
      //ProductStockId: this.SellProduct.ProductStockId,
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

    this.SellProductList.forEach((e1: any) => {
      this.Sell.TotalAmount += e1.BasicAmount;
      this.Sell.DiscountAmount += e1.DiscountAmount;
      this.Sell.TaxableAmount += e1.TaxableAmount;
      this.Sell.CGSTAmount += e1.CGSTAmount;
      this.Sell.SGSTAmount += e1.SGSTAmount;
      this.Sell.IGSTAmount += e1.IGSTAmount;
      this.Sell.NetAmount += e1.GrossAmount;
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
      this.saveDirectSell(form, form2);
    }
  }


  resetForm() {
    this.Sell = {};
    this.Sell.SellId = 0;
    this.Sell.Status = "1";
    this.Sell.CustomerId = "";
    this.Sell.CustomerName = "";
    this.Sell.EmployeeId = this.employeeDetail.EmployeeId;
    this.Sell.InvoiceDate = this.loadDataService.loadDateYMDT(new Date());
    this.submitted = false;
    this.SellProductList = [];
    $('#MobileNo').focus();
    $('#MobileNo').keypress(function (event: any) {
    });
  }

  saveDirectSell(form: NgForm, form2: NgForm) {
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
    var obj = {
      Sell: this.Sell,
      SellProductList: this.SellProductList,
      EmployeeId: this.employeeDetail.EmployeeId
    }
    this.dataLoading = true;
    this.service.saveDirectSell(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.service.printDirectSellInvoice(response.DirectSellId);
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

        this.getProductStockDetailList();
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
