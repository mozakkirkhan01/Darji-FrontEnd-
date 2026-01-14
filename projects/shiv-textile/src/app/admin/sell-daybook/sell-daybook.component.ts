import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-sell-daybook',
  templateUrl: './sell-daybook.component.html',
  styleUrls: ['./sell-daybook.component.css']
})
export class SellDaybookComponent implements OnInit {

  employeeDetail: any;
    SellDaybookReport: any[];
    dataLoading: boolean = false;
    Search: string;
    reverse: boolean;
    sortKey: string;
    p: number = 1;
    pageSize = ConstantData.PageSizes;
    itemPerPage: number = this.pageSize[0];
    dailysell: any = {};
    SalesMan: any = {};
  
    constructor(
      private service: AppService,
      private localService: LocalService,
      private loadDataService: LoadDataService,
      private router: Router
    ) { }
  
    ngOnInit(): void {
      //this.getSellList();
      this.employeeDetail = this.localService.getEmployeeDetail();
      this.dailysell.FromDate = this.loadDataService.loadDateYMD(new Date());
      this.dailysell.ToDate = this.loadDataService.loadDateYMD(new Date());
      this.getShopList();
    }
  
    onTableDataChange(p: any) {
      this.p = p;
    }
  
    sort(key: any) {
      this.sortKey = key;
      this.reverse = !this.reverse;
    }
  
    clearEmployee() {
      this.SalesMan.EmployeeId = "";
      //this.resetPurchaseProduct();
    }
    @ViewChild("table1") table: ElementRef;
    @ViewChild("table2") table2: ElementRef;
    @ViewChild("table3") table3: ElementRef;
  
    isExporting: boolean = false;
    exportToExcel() {
      this.isExporting = true;
      var itemPerPage = this.itemPerPage;
      var p = this.p;
      this.p = 1;
      this.itemPerPage = this.SellDaybookReport.length;
      setTimeout(() => {
        this.loadDataService.exportToExcel(this.table, "Sell_Report" + this.loadDataService.loadDateTime(new Date()));
        this.itemPerPage = itemPerPage;
        this.p = p;
        this.isExporting = false;
      }, 1000);
    }
  
    
    getEmployeeId(item: any) {
      this.SalesMan.EmployeeId = item.EmployeeId
    }
  
    Sell: any = {};
    SellChargeList: any[] = [];
    SellProductList: any[] = [];
    getSellDetail(SellModel: any) {
      this.dataLoading = true;
      this.service.getSellDetail(SellModel).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.Sell = response.Sell;
          this.SellChargeList = response.SellChargeList;
          this.SellProductList = response.SellProductList;
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
          else{
            this.SalesMan.Address = '';
          }
        }
      }
    
  
    SellTotal: any = {};
    getSellDaybookReport() {
      this.SellTotal.SellAmount = 0;
      this.SellTotal.DirectSellAmount = 0;
      this.SellTotal.FinalAmount = 0;
  
      this.dataLoading = true;
  
      var obj = {
        FromDate: this.loadDataService.loadDateYMD(this.dailysell.FromDate),
        ToDate: this.loadDataService.loadDateYMD(this.dailysell.ToDate),
        ShopId: this.SalesMan.ShopId
      }
  
      this.service.getSellDaybookReport(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          this.SellDaybookReport = response.SellDaybookReport;
          this.SellDaybookReport.forEach((e1: any) => {
            this.SellTotal.SellAmount += e1.SellAmount;
            this.SellTotal.DirectSellAmount += e1.DirectSellAmount;
            this.SellTotal.FinalAmount += e1.FinalAmount;
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
  
    printInvoice(id: any) {
      this.service.printSellInvoice(id);
    }

}
