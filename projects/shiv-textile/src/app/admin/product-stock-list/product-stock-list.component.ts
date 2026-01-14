import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-product-stock-list',
  templateUrl: './product-stock-list.component.html',
  styleUrls: ['./product-stock-list.component.css']
})
export class ProductStockListComponent implements OnInit {
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  ShopList:any = [];
  Shop: any = {};

  constructor(
    private service: AppService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.getShopList();
    this.getSupplierList();
    this.getCategoryList();
    this.Shop.ShopId = "";
    this.Shop.SupplierId = "";
    this.Shop.CategoryId = "";
    this.Shop.MinAmount = "";
    this.Shop.MaxAmount = "";
    this.getOnlyProductStockList();
    this.employeeDetail = this.localService.getEmployeeDetail();
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

  SupplierList:any = [];
  getSupplierList() {
    this.dataLoading = true;
    this.service.getSupplierList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SupplierList = response.SupplierList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  CategoryList:any = [];
  getCategoryList() {
    this.dataLoading = true;
    this.service.getCategoryList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.CategoryList = response.CategoryList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  OnlyProductStockList: any[] = [];
  ProductTotal: any = {};
  getOnlyProductStockList() {
    this.ProductTotal.Quantity = 0;
    var obj={
      ShopId:this.Shop.ShopId,
      SupplierId:this.Shop.SupplierId,
      CategoryId:this.Shop.CategoryId,
      MinAmount:this.Shop.MinAmount,
      MaxAmount:this.Shop.MaxAmount,
    }
    this.dataLoading = true;
    this.service.getOnlyProductStockList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.OnlyProductStockList = response.OnlyProductStockList;
        this.OnlyProductStockList.forEach((e1: any) => {
          this.ProductTotal.Quantity += e1.Quantity;
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

  printBadcode(form: NgForm) {
    this.submitted = true;
    if (!form.valid) {
      toastr.error("Quantity is required!!");
    }
    var id: string = this.selectedBarcode.ProductStockId + '-' + this.selectedBarcode.Quantity;
    this.service.printBarCode(id);
    $('#modal_popUp').modal('hide');
    this.selectedBarcode = {};
  }

  NewprintBarcode() {
    var id: string = this.selectedBarcode.ProductStockId + '-' + this.selectedBarcode.Quantity;

    this.service.printNewBarCode(id);
    // this.PrintList = [];
  }

  selectedBarcode: any = {};
  getProductBarcode(obj?: any) {
    this.selectedBarcode = obj;
    $('#modal_popUp').modal('show');
  }

}
