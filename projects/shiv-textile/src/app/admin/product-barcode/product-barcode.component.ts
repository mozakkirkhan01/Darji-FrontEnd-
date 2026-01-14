import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { HttpClient } from '@angular/common/http';
import { LoadDataService } from '../../utils/load-data.service';

@Component({
  selector: 'app-product-barcode',
  templateUrl: './product-barcode.component.html',
  styleUrls: ['./product-barcode.component.css']
})
export class ProductBarcodeComponent implements OnInit {

  Product: any = {};
  Item: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  PrintList: any[] = [];
  dataLoading: boolean = false;
  submitted: boolean;
  Search: string;
  reverse: boolean;
  sortKey: string;
  private http: HttpClient

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadData: LoadDataService
  ) { }

  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  

  resetProduct() {
    // if (form != null) {
    //   form.reset();
    // }
    this.Item = {};
    this.Item.Status = "1";
    this.Item.CompanyName = "KANHA BAKERY";
    this.Item.UnitId = "";
    this.Item.CategoryId = "";
    this.Item.SizeId = "";

    this.submitted = false;
  }

  newProduct() {
    this.resetProduct();
    $('#modal_product').modal('show');
  }

  
  PrintProduct: any = {};
  addBardcode(productModel: any) {
    this.PrintProduct.TotalPrintQuantity = 0;
    
    this.PrintList.push(productModel);
    
    
    for (let i = 0; i < this.PrintList.length; i++) {
      const e2 = this.PrintList[i];
      this.PrintProduct.TotalPrintQuantity += e2.PrintQuantity;
    }
      this.Product = {};
  }

  removeBarcode(i: number) {
    this.PrintList.splice(i, 1);
  }

  printBarCodeFinal() {
    var obj = {
      BarCodeList: this.PrintList
    }
    this.service.printBarCodeFinal(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)).toString()));

    this.PrintList = [];
  }

  printBarCodeNewFinal() {
    var obj = {
      BarCodeList: this.PrintList
    }
    this.service.printBarCodeNewFinal(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)).toString()));

    this.PrintList = [];
  }

}
