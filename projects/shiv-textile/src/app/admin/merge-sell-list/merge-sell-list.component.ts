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
  selector: 'app-merge-sell-list',
  templateUrl: './merge-sell-list.component.html',
  styleUrls: ['./merge-sell-list.component.css']
})
export class MergeSellListComponent implements OnInit {
  employeeDetail: any;
  MergeSellList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  dailysell: any = {};
  HsnSell: any = {};
  EmployeeList: any[];

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
    this.getShopList();
    this.getHsnList();
    this.getGSTList();
    this.getEmployeeList();
    this.dailysell.SearchType = "";
  }
  @ViewChild("table1") table: ElementRef;

  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.MergeSellList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table, "Sell GST Report " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  onTableDataChange(p: any) {
    this.p = p;
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
      if (e.ShopId == this.SalesMan.ShopId) {
        this.SalesMan.Address = e.Address;
        break;
      }
      else {
        this.SalesMan.Address = '';
      }
    }
  }


  getEmployeeList(EmployeeId?: number) {
    this.dataLoading = true;
    this.service.getEmployeeList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.EmployeeList = response.EmployeeList;
        this.EmployeeList.map(e1 => e1.SearchEmployee = `${e1.EmployeeName} -  ${e1.MobileNo}`)
        if (EmployeeId != null) {
          for (let i = 0; i < this.EmployeeList.length; i++) {
            const e2 = this.EmployeeList[i];
            if (e2.EmployeeId == EmployeeId) {
              this.SalesMan.EmployeeId = e2.EmployeeId;
              break;
            }
          }
        }
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
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

  SalesMan: any = {};

  clearEmployee() {
    this.SalesMan.EmployeeId = "";
    //this.resetPurchaseProduct();
  }

  getEmployeeId(item: any) {
    this.SalesMan.EmployeeId = item.EmployeeId
  }

  CompleteSellsManReport: any[] = [];
  getCompleteSellsManReport() {
    $('#modal_Summary').modal('show');
    this.dataLoading = true;
    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.dailysell.ToDate),
      EmployeeId: this.SalesMan.EmployeeId
    }
    this.service.getCompleteSellsManReport(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.CompleteSellsManReport = response.CompleteSellsManReport;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  @ViewChild("table2") table2: ElementRef;
  @ViewChild("table3") table3: ElementRef;

  exportToExcel1() {
    $('#modal_Summary').modal('hide');
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.CompleteSellsManReport.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table2, "SalesMan_Report" + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  CompleteBillerReport: any[] = [];
  getCompleteBillerReport() {
    $('#modal_Biller').modal('show');
    this.dataLoading = true;
    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.dailysell.ToDate),
      EmployeeId: this.SalesMan.EmployeeId
    }
    this.service.getCompleteBillerReport(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.CompleteBillerReport = response.CompleteBillerReport;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  exportToExcel2() {
    $('#modal_Biller').modal('hide');
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.getCompleteBillerReport.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table3, "Biller_Report" + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  Sell: any = {};
  SellChargeList: any[] = [];
  SellProductList: any[] = [];
  getDirectSellDetail(SellModel: any) {
    this.dataLoading = true;
    this.service.getDirectSellDetail(SellModel).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Sell = response.DirectSell;
        //this.SellChargeList = response.SellChargeList;
        this.SellProductList = response.DirectSellProductList;
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
  getMergeSellList() {
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
      EmployeeId: this.SalesMan.EmployeeId,
      //HSNCode: item.HSNCode,
      ShopId: this.SalesMan.ShopId,
      //GSTPercentage: item.GSTPercentage,
      SearchType: this.dailysell.SearchType,
      HSNCode: this.HsnSell.HSNCode,
    }

    this.service.getMergeSellList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.MergeSellList = response.MergeSellList;
        this.MergeSellList.forEach((e1: any) => {

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
