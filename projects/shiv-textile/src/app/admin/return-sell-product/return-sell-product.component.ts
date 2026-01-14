import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LocalService } from '../../utils/local.service';
import { LoadDataService } from '../../utils/load-data.service';
@Component({
  selector: 'app-return-sell-product',
  templateUrl: './return-sell-product.component.html',
  styleUrls: ['./return-sell-product.component.css']
})
export class ReturnSellProductComponent implements OnInit {
  dataLoading: boolean = false;
  SellList: any[];
  BillDetailList: any[];
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  SellProduct: any = {};
  Return: any = {};
  submitted: boolean;
  Sell: any = {};
  Bill: any = {};
  employeeDetail: any;
  ReturnList: any[] = [];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private router: Router,
    private loadDataService: LoadDataService,
  ) { }

  ngOnInit(): void {
    //this.getSellList();
    this.getEmployeeList();
    this.resetSellProduct();
    this.getGSTList();
    this.getProductStockDetailList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.Sell.EmployeeId = 1002
  }

  ReturnProduct: any = {};
  addReturnList(productModel: any) {
    // this.ReturnProduct.TotalPrintQuantity = 0;
    // this.ReturnProduct.TotalQuantity = 0
    // if (productModel.SellingStatus == 2) {
    //   toastr.error("This product is already return.");
    //   return;
    // }
    var obj = {
      SellId: productModel.SellId,
      SellProductId: productModel.SellProductId,
      ProductStockId: productModel.ProductStockId,
      StockCode: productModel.StockCode,
      ProductName: productModel.ProductName,
      HSNCode: productModel.HSNCode,
      MRP: productModel.MRP,
      SellingPrice: productModel.SellingPrice,
      Quantity: productModel.Quantity,
      ReturnQuantity: productModel.Quantity,
      UnitName: productModel.UnitName,
      DiscountPercentage: productModel.DiscountPercentage,
      DiscountAmount: productModel.DiscountAmount,
      TaxableAmount: productModel.TaxableAmount,
      GSTPercentage: productModel.GSTPercentage,
      CGSTAmount: productModel.CGSTAmount,
      SGSTAmount: productModel.SGSTAmount,
      IGSTAmount: productModel.IGSTAmount,
      GrossAmount: productModel.GrossAmount,
    }
    this.ReturnList.push(obj);
    for (let i = 0; i < this.BillDetailList.length; i++) {
      const e1 = this.BillDetailList[i];
      if (e1.SellProductId == productModel.SellProductId) {

        this.BillDetailList.splice(i, 1);
        break;
      }

    }

    for (let i = 0; i < this.ReturnList.length; i++) {
      const e2 = this.ReturnList[i];
      this.ReturnProduct.Quantity = e2.Quantity;
      //break;
    }
    // if (this.BillDetailList.length == 0) {
    //   // this.Product = {};
    //   const ele = this.formProductElement.nativeElement[0];
    //   if (ele)
    //     ele.focus();
    // }
  }

  changeReturnSellingPrice(SellProduct: any) {
    if (SellProduct.AvailableQuantity == 0) {
      toastr.error("No stock is available !!");
      SellProduct.ReturnQuantity = 0;
    }
    if (SellProduct.AvailableQuantity < SellProduct.ReturnQuantity) {
      toastr.error("Quantity should not be more than " + SellProduct.AvailableQuantity);
      SellProduct.ReturnQuantity = 0;
    }
    SellProduct.BasicAmount = this.loadDataService.round((SellProduct.ReturnQuantity * SellProduct.SellingPrice), 2);
    SellProduct.DiscountAmount = (SellProduct.DiscountAmount == null ? 0 : SellProduct.DiscountAmount);
    if (SellProduct.DiscountPercentage != null) {
      SellProduct.DiscountPercentage = SellProduct.DiscountPercentage;
      SellProduct.DiscountAmount = this.loadDataService.round(SellProduct.BasicAmount * SellProduct.DiscountPercentage / 100, 2);
    }
    SellProduct.GrossAmount = this.loadDataService.round(SellProduct.BasicAmount - SellProduct.DiscountAmount, 0);
    var netAmount: number = this.loadDataService.round(SellProduct.GrossAmount / SellProduct.ReturnQuantity, 0);
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
  };

  removeRetutnList(i: number) {
    this.ReturnList.splice(i, 1);
  }

  submit(event: any, form: NgForm) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '43') {
      this.saveNewSellItem(form);
    }
  }

  changeProductInput(event: any, form: NgForm) {
    for (let i1 = 0; i1 < this.ProductStockList.length; i1++) {
      const e1 = this.ProductStockList[i1];
      if (e1.StockCode == event) {
        this.afterProductStockSelected(e1);
        this.addSellProduct(form, 1);
        break;
      }
    }
  }



  getSellDetail(SellId: number) {
    this.dataLoading = true;
    this.service.getSellDetail({ SellId: SellId }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Sell = response.Sell;
        this.Sell.InvoiceDate = this.loadDataService.loadDateYMD(this.Sell.InvoiceDate);
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

  GSTList: any[] = [];
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

  SellProductList: any[] = [];
  ProductStockList: any[] = [];
  isProductSubmitted: boolean = false;

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

  @ViewChild('formProductElement') formProductElement: ElementRef;
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



  resetSellProduct() {
    this.SellProduct = {};
    this.SellProduct.MRP = null;
    this.SellProduct.GSTPercentage = 0;
    this.SellProduct.UnitName = null;
    this.isProductSubmitted = false;
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


  IsVisible: boolean = false;
  ShowHide() {
    this.IsVisible = this.IsVisible ? false : true;
    //this.resetForm();

    // this.Sell.EmployeeId = this.employeeDetail.EmployeeId;
  }

  resetForm() {
    this.Sell = {};
    this.Sell.SellId = 0;
    this.Sell.Status = "1";
    this.Sell.CustomerId = "";
    this.Sell.CustomerName = "Cash";
    this.Sell.EmployeeId = this.employeeDetail.EmployeeId;
    this.Sell.InvoiceDate = this.loadDataService.loadDateYMD(new Date());
    this.submitted = false;
    this.SellProductList = [];
    $('#MobileNo').focus();
    $('#MobileNo').keypress(function (event: any) {
    });
  }

  getProductStockDetailList() {
    this.dataLoading = true;
    this.service.getProductStockDetailList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockList = response.ProductStockList;
        this.ProductStockList.map(c1 => c1.SearchProduct = `${c1.StockCode} - ${c1.ProductName}- ${c1.SizeName} - ${c1.HSNCode}`)
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }


  clearProductStock() {
    this.SellProduct.ProductId = 0;
    this.resetSellProduct();
  }

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

  removeData(list: any[], index: number) {
    list.splice(index, 1);
    this.calculateTotal();
  }

  getSellList() {

    this.dataLoading = true;
    this.service.getSellList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SellList = response.SellList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }




  changeBillText(text: any) {
  }

  afterBillSelected(item: any) {
    this.Bill.SellId = item.SellId;
    //this.getBillDetailList(item);
  }

  getBillDetailList() {
    // this.Sell.SellId = item.SellId;
    // this.Sell.InvoiceDate = this.loadDataService.loadDateYMD(item.InvoiceDate);
    // this.Sell.MobileNo = item.MobileNo;
    // this.Sell.TotalAmount = item.TotalAmount;
    // this.Sell.DiscountAmount = item.DiscountAmount;
    // this.Sell.NetAmount = item.NetAmount;
    // this.Sell.GrandTotal = item.GrandTotal;
    // this.Sell.TaxableAmount = item.TaxableAmount;
    // this.Sell.CGSTAmount = item.CGSTAmount;
    // this.Sell.SGSTAmount = item.SGSTAmount;
    // this.Sell.IGSTAmount = item.IGSTAmount;

    var obj = {
      InvoiceNo: this.Bill.InvoiceNo
    }

    this.dataLoading = true;
    this.service.getBillDetailList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.BillDetailList = response.BillDetailList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }
  clearCustomer() {
    this.SellProduct.InvoiceNo = null;
  }

  resetReturn() {
    this.ReturnList = [];
    this.ReturnProduct = {};
    this.BillDetailList = [];
  }

  redUrl: string;
  saveNewSellItem(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
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
      EmployeeId: this.employeeDetail.EmployeeId,
      returns: this.ReturnList,
      Quantity: this.ReturnProduct.Quantity
    }
    this.dataLoading = true;
    this.service.saveNewSellItem(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.service.printNewSellInvoice(response.SellId);
        if (this.redUrl)
          this.router.navigate([this.redUrl]);
        // form2.reset();
        // form.reset();
        var empId = this.Sell.EmployeeId;
        this.resetForm();
        this.Sell.EmployeeId = empId;
        this.resetReturn();
        this.resetSellProduct();
        form.control.markAsPristine();
        form.control.markAsUntouched();
        this.Bill.InvoiceNo = "";

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

  openPopup() {
    $('#modal_popUp').modal('show');
  }

  SaveReturnProduct() {
    this.submitted = true;
    this.dataLoading = true;
    var obj = {
      Sell: this.Sell,
      SellProductList: this.SellProductList,
      EmployeeId: this.employeeDetail.EmployeeId,
      returns: this.ReturnList,
      Quantity: this.ReturnProduct.Quantity
    }
    this.service.saveReturnProduct(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.Message = "Your item is return successfully!!";
        this.service.printNewSellInvoice(response.SellId);
        if (this.redUrl)
          this.router.navigate([this.redUrl]);
        // form2.reset();
        // form.reset();
        var empId = this.Sell.EmployeeId;
        this.resetForm();
        this.Sell.EmployeeId = empId;
        this.resetReturn();
        this.resetSellProduct();
        $('#modal_popUp').modal('hide');
        this.Bill.InvoiceNo = "";
        this.getProductStockDetailList();
      } else {
        toastr.error(response.Message);
      }
      //this.getBillDetailList();
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error occured while fetching data.");
      this.dataLoading = false;
    }));
  }

}
