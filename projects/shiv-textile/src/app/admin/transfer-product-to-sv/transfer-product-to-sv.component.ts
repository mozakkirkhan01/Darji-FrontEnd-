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
  selector: 'app-transfer-product-to-sv',
  templateUrl: './transfer-product-to-sv.component.html',
  styleUrls: ['./transfer-product-to-sv.component.css']
})
export class TransferProductToSVComponent implements OnInit {
  Transfer: any = {};
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
    this.getProductStockDetailList();
    this.getGSTList();
    this.getEmployeeList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetSellProduct();
    this.resetForm();
    this.TotalTransferProduct.TotalQuantity = 0;
    this.route.queryParams.subscribe((params: any) => {
      this.Transfer.TransferId = params.id;
      this.redUrl = params.redUrl;
      if (this.Transfer.TransferId > 0)
        this.getSellDetail(this.Transfer.TransferId);
      else
        this.Transfer.TransferId = 0;
    });
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

  getSellDetail(SellId: number) {
    this.dataLoading = true;
    this.service.getSellDetail({ SellId: SellId }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Transfer = response.Sell;
        this.TransferProductList = response.SellProductList;
        this.TransferProductList.map(x => x.SearchProduct = `${x.ProductName} - ${x.HSNCode}`);
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
    this.Transfer.CustomerId = item.CustomerId;
    this.SelectedCustomer = item;
  }

  clearCustomer() {
    this.Transfer.CustomerId = null;
  }

  removeData(list: any[], index: number) {
    list.splice(index, 1);
    this.calculateTotal();
    this.TotalTransferProduct.TotalQuantity = 0;
    for (let i = 0; this.TransferProductList.length > 0; i++) {
      const e2 = this.TransferProductList[i];
      this.TotalTransferProduct.TotalQuantity += e2.Quantity;
    }
  }

  //Sell Product
  TransferProductList: any[] = [];
  ProductStockList: any[] = [];
  TransferProduct: any = {};
  TotalTransferProduct: any = {};
  GSTList: any[] = [];
  isProductSubmitted: boolean = false;

  resetSellProduct() {
    this.TransferProduct = {};
    this.TransferProduct.UnitName = null;
    this.isProductSubmitted = false;
    this.TransferProduct.Quantity = 1;
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

  afterProductStockSelected(item: any) {
    //Check Product is already added
    for (let i = 0; i < this.TransferProductList.length; i++) {
      const e1 = this.TransferProductList[i];
      e1.TotalQuantity += e1.Quantity;
      if (e1.ProductStockId == item.ProductStockId) {
        toastr.error("This product is already added");
        this.resetSellProduct();
        return;
      }
    }
    this.TransferProduct.ProductStockId = item.ProductStockId;
    this.TransferProduct.ProductName = item.ProductName;
    this.TransferProduct.AvailableQuantity = item.AvailableQuantity;
    this.TransferProduct.HSNCode = item.HSNCode;
    this.TransferProduct.StockCode = item.StockCode;
    this.TransferProduct.SearchProduct = item.SearchProduct;
    this.TransferProduct.UnitName = item.UnitName;
    this.TransferProduct.MRP = item.MRP;
    this.TransferProduct.CategoryName = item.CategoryName;
    this.TransferProduct.SellingPrice = item.SellingPrice;
    this.TransferProduct.AvailableQuantity = item.Quantity;
    if (this.TransferProduct.Quantity == null)
      this.TransferProduct.Quantity = 1;
    if (item.DiscountPercentage > 0) {
      this.TransferProduct.DiscountPercentage = item.DiscountPercentage;
    }
    this.changeTransferQuantity(this.TransferProduct);
  }

  clearProductStock() {
    this.TransferProduct.ProductId = 0;
    this.resetSellProduct();
  }

  changeTransferQuantity(SellProduct: any) {
    if (SellProduct.AvailableQuantity == 0) {
      toastr.error("No stock is available !!");
      SellProduct.Quantity = 0;
    }
    if (SellProduct.AvailableQuantity < SellProduct.Quantity) {
      toastr.error("Quantity should not be more than " + SellProduct.AvailableQuantity);
      SellProduct.Quantity = 0;
    }
    
    this.TotalTransferProduct.TotalQuantity = 0;
    this.TransferProductList.forEach(e1 => {
      this.TotalTransferProduct.TotalQuantity += e1.Quantity;
    });
  };

  calculateGST(SellProduct: any) {
  }

  changeDiscountAmount(SellProduct: any) {
  }

  addSellProduct(form: NgForm, isCheck?: number) {
    this.isProductSubmitted = true;
    if (form.invalid && isCheck != 1) {
      return;
    }

    if (this.TransferProduct.ProductName == null) {
      toastr.warning("Selected Product is invalid.");
      this.dataLoading = false;
      return;
    }


    this.TotalTransferProduct.TotalQuantity = 0;
    var obj = {
      ProductStockId: this.TransferProduct.ProductStockId,
      SearchProduct: this.TransferProduct.SearchProduct,
      MRP: this.TransferProduct.MRP,
      CategoryName: this.TransferProduct.CategoryName,
      SellingPrice: this.TransferProduct.SellingPrice,
      ProductName: this.TransferProduct.ProductName,
      StockCode: this.TransferProduct.StockCode,
      HSNCode: this.TransferProduct.HSNCode,
      UnitName: this.TransferProduct.UnitName,
      Quantity: this.TransferProduct.Quantity,
      AvailableQuantity: this.TransferProduct.AvailableQuantity
    }
    this.TransferProductList.push(obj);

    // for (let i1 = 0; i1 < this.TransferProductList.length; i1++) {
    //   const e1 = this.TransferProductList[i1];
    //   this.TotalTransferProduct.TotalQuantity += e1.Quantity;

    //}
    this.TransferProductList.forEach(e1 => {
      this.TotalTransferProduct.TotalQuantity += e1.Quantity;
    });

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
      this.saveTransfertoSV(form, form2);
    }
  }


  resetForm() {
    this.Transfer = {};
    this.Transfer.TransferId = 0;
    this.Transfer.EmployeeId = this.employeeDetail.EmployeeId;
    this.Transfer.TransferDate = this.loadDataService.loadDateYMD(new Date());
    this.submitted = false;
    this.TransferProductList = [];
    $('#MobileNo').focus();
    $('#MobileNo').keypress(function (event: any) {
    });
  }
  getwilddata() {

  }
  saveTransfertoSV(form: NgForm, form2: NgForm) {
    this.submitted = true;
    if (form.invalid || form2.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    if (this.TransferProductList.length == 0) {
      toastr.warning("No Product is selected", "Invailid Form")
      this.dataLoading = false;
      return;
    }

    this.Transfer.TransferDate = this.loadDataService.loadDateYMD(this.Transfer.TransferDate)
    var obj = {
      transfer: this.Transfer,
      transferItem: this.TransferProductList,
      EmployeeId: this.employeeDetail.EmployeeId
    }
    this.dataLoading = true;
    this.service.saveTransfertoSV(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        //this.service.printDirectSellInvoice(response.DirectSellId);
        if (this.redUrl)
          this.router.navigate([this.redUrl]);
        // form2.reset();
        // form.reset();
        var empId = this.Transfer.EmployeeId;
        this.resetForm();
        this.Transfer.EmployeeId = empId;
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
