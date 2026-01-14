import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { LoadDataService } from '../../utils/load-data.service';

@Component({
  selector: 'app-gr-data-report',
  templateUrl: './gr-data-report.component.html',
  styleUrls: ['./gr-data-report.component.css']
})
export class GrDataReportComponent implements OnInit {

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

    this.SellProduct.FromDate = this.loadDataService.loadDateYMD(new Date);
    this.SellProduct.ToDate = this.loadDataService.loadDateYMD(new Date);
    this.getShopList();
    this.getGRDataReport();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  ShopList: any = [];
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

  selectShopAddress() {

    for (let i = 0; i < this.ShopList.length; i++) {
      const e = this.ShopList[i];
      if (e.ShopId == this.SellProduct.ShopId) {
        this.SellProduct.Address = e.Address;
        break;
      }
      else {
        this.SellProduct.Address = '';
      }
    }
  }

  SellProduct: any = {};
  ProductTotal: any = {};
  GRDataReport: any[] = [];
  getGRDataReport() {
    this.ProductTotal.TotalQuantity = 0;
    this.ProductTotal.TotalTaxableAmount = 0;
    this.ProductTotal.TotalGSTAmount = 0;
    this.ProductTotal.TotalAmount = 0;
    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.SellProduct.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.SellProduct.ToDate),
      ShopId: this.SellProduct.ShopId
    }
    this.dataLoading = true;
    this.service.getGRDataReport(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.GRDataReport = response.GRDataReport;
        this.GRDataReport.forEach((e1: any) => {
          this.ProductTotal.TotalQuantity += e1.TotalQuantity;
          this.ProductTotal.TotalTaxableAmount += e1.TotalTaxableAmount;
          this.ProductTotal.TotalGSTAmount += e1.TotalGSTAmount;
          this.ProductTotal.TotalAmount += e1.TotalAmount;
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

  GRDataDetailReport: any[] = [];
  getGRDataDetailReport(data: any) {
    var obj = {
      GrSupplierId: data.GrSupplierId
    }
    this.dataLoading = true;
    this.service.getGRDataDetailReport(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.GRDataDetailReport = response.GRDataDetailReport;
        $('#modal_popUp').modal('show');

      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  printBill(data: any) {
    this.service.getPrintGRBill(data.GrSupplierId);
  }


}
