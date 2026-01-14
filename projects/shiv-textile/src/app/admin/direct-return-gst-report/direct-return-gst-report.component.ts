import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import * as XLSX from "xlsx";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";


@Component({
  selector: 'app-direct-return-gst-report',
  templateUrl: './direct-return-gst-report.component.html',
  styleUrls: ['./direct-return-gst-report.component.css']
})
export class DirectReturnGstReportComponent implements OnInit {
  employeeDetail: any;
  GstDirectReturnList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  dailysell: any = {};
  HsnSell: any = {};

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.dailysell.FromDate = this.loadDataService.loadDateYMD(new Date());
    this.dailysell.ToDate = this.loadDataService.loadDateYMD(new Date());
    this.getHsnList();
    this.getGSTList();
    //this.dailysell.GSTPercentage = 0;
    this.dailysell.SearchType = "";
  }

  @ViewChild("table1") table: ElementRef;

  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.GstDirectReturnList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table, "Direct Sell Return GST Report " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  clearProduct() {
    this.HsnSell.HSNCode = "";
    //this.resetPurchaseProduct();
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

  // Sell: any = {};
  // SellChargeList: any[] = [];
  // SellProductList: any[] = [];
  // getDirectSellDetail(SellModel: any) {
  //   this.dataLoading = true;
  //   this.service.getDirectSellDetail(SellModel).subscribe(r1 => {
  //     let response = r1 as any;
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.Sell = response.DirectSell;
  //       //this.SellChargeList = response.SellChargeList;
  //       this.SellProductList = response.DirectSellProductList;
  //       $('#modal_popUp').modal('show');
  //     } else {
  //       toastr.error(response.Message);
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     toastr.error("Error Occured while fetching data.");
  //     this.dataLoading = false;
  //   }));
  // }

  HsnList: any[] = [];
  getHsnList(HSNCode?: string) {
    this.dataLoading = true;
    this.service.getHsnList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.HsnList = response.HsnList;
        this.HsnList.map(c1 => c1.SearchProduct = `${c1.HSNCode}`)
        if (HSNCode != null) {
          for (let i = 0; i < this.HsnList.length; i++) {
            const e1 = this.HsnList[i];
            if (e1.HSNCode == HSNCode) {
              this.HsnSell.HSNCode = e1.HSNCode;
              break;
            }
          }
        }
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getHsnCode(item: any) {
    this.HsnSell.HSNCode = item.HSNCode
  }

  changeHsn() {
    if (this.dailysell.SearchType == 2)
      this.HsnSell.productAutoComplete = null;
    this.HsnSell.HSNCode = null;
  }

  SellTotal: any = {};
  getGstDirectReturnList() {
    this.SellTotal.DiscountAmount = 0;
    this.SellTotal.TaxableAmount = 0;
    this.SellTotal.CGSTAmount = 0;
    this.SellTotal.SGSTAmount = 0;
    this.SellTotal.IGSTAmount = 0;
    this.SellTotal.NetAmount = 0;
    this.SellTotal.RoundOff = 0;
    this.SellTotal.GrossAmount = 0;
    // if (item.HSNCode != null) {
    //   this.dailysell.GSTPercentage = 0;
    // }
    // if (item.GSTPercentage > 0) {
    //   this.HsnSell.productAutoComplete = null;
    // }

    this.dataLoading = true;
    var obj = {
      FromDate: this.loadDataService.loadDateYMDT(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMDT(this.dailysell.ToDate),
      //HSNCode: item.HSNCode,
      //GSTPercentage: item.GSTPercentage,
      SearchType: this.dailysell.SearchType,
      HSNCode: this.HsnSell.HSNCode,
    }

    this.service.getGstDirectReturnList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.GstDirectReturnList = response.GstDirectReturnList;
        this.GstDirectReturnList.forEach((e1: any) => {

          this.SellTotal.DiscountAmount += e1.DiscountAmount;
          this.SellTotal.TaxableAmount += e1.TaxableAmount;
          this.SellTotal.CGSTAmount += e1.CGSTAmount;
          this.SellTotal.SGSTAmount += e1.SGSTAmount;
          this.SellTotal.IGSTAmount += e1.IGSTAmount;
          this.SellTotal.NetAmount += e1.NetAmount;
          this.SellTotal.RoundOff += e1.RoundOff;
          this.SellTotal.GrossAmount += e1.GrossAmount;
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

  getOldBillPrint(obj: any) {
    this.service.printDirectSellInvoice(obj.ReturnSellId);
  }

  getNewBillPrint(obj: any) {
    this.service.printDirectSellInvoice(obj.DirectSellId);
  }

  getReturnBillPrint(obj: any) {
    this.service.printNewDirectSellInvoice(obj.DirectSellId);
  }

  printInvoice(id: any) {
    this.service.printDirectSellInvoice(id);
  }

}
