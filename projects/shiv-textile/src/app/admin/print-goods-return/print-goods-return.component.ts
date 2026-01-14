import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { LoadDataService } from '../../utils/load-data.service';

@Component({
  selector: 'app-print-goods-return',
  templateUrl: './print-goods-return.component.html',
  styleUrls: ['./print-goods-return.component.css']
})
export class PrintGoodsReturnComponent implements OnInit {

  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService

  ) { }

  ngOnInit(): void {
    this.getSupplierList();

    this.SellProduct.FromDate = this.loadDataService.loadDateYMD(new Date),
      this.SellProduct.ToDate = this.loadDataService.loadDateYMD(new Date),

      //this.getPrintGoodsReturnList();
      this.employeeDetail = this.localService.getEmployeeDetail();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  SupplierList: any[] = [];

  getSupplierList() {
    var obj = {
      Status: 1,
      //ShopId: this.Sell.ShopId
    }
    this.dataLoading = true;
    this.service.getSupplierList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SupplierList = response.SupplierList;
        this.SupplierList.map(c1 => c1.SearchProduct = `${c1.CompanyName}`)
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  // afterProductStockSelected(item: any) {
  //  this.SellProduct.ProductStockId = item.ProductStockId;
  //  this.getPrintGoodsReturnList();

  // }

  clearProductStock() {
    this.SellProduct.SupplierId = 0;
  }

  AddPrintGoodsReturnList: any[] = [];
  ProductTotal: any = {};

  addSelectedItem(data: any) {

    this.ProductTotal.TotalQuantity = 0;
    this.ProductTotal.TotalTaxableAmount = 0;
    this.ProductTotal.TotalGSTAmount = 0;
    this.ProductTotal.TotalAmount = 0;
    this.AddPrintGoodsReturnList.push(data);

    for (let i = 0; i < this.PrintGoodsReturnList.length; i++) {
      const e1 = this.PrintGoodsReturnList[i];
      if (e1.GoodsReturnId == data.GoodsReturnId) {

        this.PrintGoodsReturnList.splice(i, 1);
        break;
      }

    }

    this.AddPrintGoodsReturnList.forEach((e1: any) => {
      this.ProductTotal.TotalQuantity += e1.Quantity;
      this.ProductTotal.TotalTaxableAmount += e1.TaxableAmount;
      this.ProductTotal.TotalGSTAmount += e1.GstAmount;
      this.ProductTotal.TotalAmount += e1.GrossAmount;
    });

  }

  reset() {
    this.AddPrintGoodsReturnList = [],
      this.PrintGoodsReturnList = [],
      this.ProductTotal = []

  }

  SellProduct: any = {};
  PrintGoodsReturnList: any[] = [];
  getPrintGoodsReturnList(item: any) {
    this.SellProduct.SupplierId = item.SupplierId;

    var obj = {
      SupplierId: item.SupplierId,
      FromDate: this.loadDataService.loadDateYMD(this.SellProduct.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.SellProduct.ToDate)
    }
    this.dataLoading = true;
    this.service.getPrintGoodsReturnList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PrintGoodsReturnList = response.PrintGoodsReturnList;

      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  saveGRBill() {
    this.submitted = true;
    var Supplier = {
      SupplierId: this.SellProduct.SupplierId,
      TotalQuantity: this.ProductTotal.TotalQuantity,
      TotalTaxableAmount: this.ProductTotal.TotalTaxableAmount,
      TotalGSTAmount: this.ProductTotal.TotalGSTAmount,
      TotalAmount: this.ProductTotal.TotalAmount
    }
    var obj = {
      Supplier: Supplier,
      ProductDetail: this.AddPrintGoodsReturnList,
      EmployeeId: this.employeeDetail.EmployeeId
    }
    this.dataLoading = true;
    this.service.saveGRBill(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.service.getPrintGRBill(response.GrSupplierId);
        this.reset();
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
