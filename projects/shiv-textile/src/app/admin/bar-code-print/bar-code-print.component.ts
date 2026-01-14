import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
declare var toastr: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-bar-code-print',
  templateUrl: './bar-code-print.component.html',
  styleUrls: ['./bar-code-print.component.css']
})
export class BarCodePrintComponent implements OnInit {
  Product: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  ProductList: any[];
  ProductStockList: any[] = [];
  PrintList: any[] = [];
  dataLoading: boolean = false;
  submitted: boolean;
  Search: string;
  reverse: boolean;
  sortKey: string;


  constructor(
    private service: AppService,
    private orderPipe: OrderPipe,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getProductStockDetailList(ProductId: any) {
    var obj = { Status: 1, ProductId: ProductId };
    this.dataLoading = true;
    this.service.getProductStockDetailList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockList = response.ProductStockList;
        this.ProductStockList.forEach((e1: any) => {
          e1.PrintQuantity = e1.Quantity;
        });
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
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

  submit(event: any) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '43') {
      this.printBadcode();
      this.Product = {};
    }
  }

  getProductList() {
    this.dataLoading = true;
    this.service.getProductList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductList = response.ProductList;
        this.ProductList.map(c1 => c1.SearchProduct = `${c1.ProductName} - ${c1.DesignNo}  - ${c1.HSNCode} - ${c1.CompanyName}`)
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  afterProductSelected(item: any) {
    this.getProductStockDetailList(item.ProductId);
  }

  clearProduct() {
    this.ProductStockList = [];
  }
  PrintProduct: any = {};
  addBardcode(productModel: any) {
    this.PrintProduct.TotalPrintQuantity = 0;
    this.PrintProduct.TotalQuantity = 0
    if (productModel.PrintQuantity == null) {
      toastr.error("Quantity is required");
      return;
    }
    this.PrintList.push(productModel);
    for (let i = 0; i < this.ProductStockList.length; i++) {
      const e1 = this.ProductStockList[i];
      if (e1.ProductStockId == productModel.ProductStockId) {

        this.ProductStockList.splice(i, 1);
        break;
      }

    }

    for (let i = 0; i < this.PrintList.length; i++) {
      const e2 = this.PrintList[i];
      this.PrintProduct.TotalPrintQuantity += e2.PrintQuantity;
      this.PrintProduct.TotalQuantity += e2.Quantity

      //break;
    }
    if (this.ProductStockList.length == 0) {
      this.Product = {};
      const ele = this.formProductElement.nativeElement[0];
      if (ele)
        ele.focus();
    }
  }

  removeBarcode(i: number) {
    this.PrintList.splice(i, 1);
  }

  printBadcode() {
    var id: string = '', qty: string = '';
    this.PrintList.forEach((e1: any, index: number) => {
      if (index == 0) {
        id += e1.ProductStockId;
        qty += e1.PrintQuantity;
      }
      else {
        id += '_' + e1.ProductStockId;
        qty += '_' + e1.PrintQuantity;
      }
    });
    this.service.printBarCode(id + '-' + qty);
    // this.PrintList = [];
  }

  NewprintBarcode() {
    var id: string = '', qty: string = '';
    this.PrintList.forEach((e1: any, index: number) => {
      //if(e1.IsSelected){
        if (index == 0) {
          id += e1.ProductStockId;
          qty += e1.PrintQuantity;
        }
        else {
          id += '_' + e1.ProductStockId;
          qty += '_' + e1.PrintQuantity;
        }
     // }
     
    });
    this.service.printNewBarCode(id + '-' + qty);
    // this.PrintList = [];
  }


}


