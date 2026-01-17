import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
@Component({
  selector: 'app-dailysell-list',
  templateUrl: './dailysell-list.component.html',
  styleUrls: ['./dailysell-list.component.css']
})
export class DailysellListComponent implements OnInit {
  employeeDetail: any;
  DailySellList: any[];
  paymentModes = ConstantData.PaymentModeList;
  SaleBillerReport: any[];
  SaleSummaryReport: any[];
  EmployeeList: any[];
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
    this.getEmployeeList();
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
    this.itemPerPage = this.DailySellList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table, "Sell_Report" + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  exportToExcel2() {
    $('#modal_Biller').modal('hide');
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.SaleBillerReport.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table3, "Biller_Report" + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  //BillerReport: any[] = [];
  getSaleBillerReport() {
    $('#modal_Biller').modal('show');
    this.dataLoading = true;
    this.SaleBillerReport = [];

    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.dailysell.ToDate),
      EmployeeId: this.SalesMan.EmployeeId
    }

    this.service.getSaleBillerReport(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SaleBillerReport = response.SaleBillerReport;
        //this.BillerReport.push(this.SaleBillerReport);
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  //SummaryReport: any[] = [];
  getSaleSummaryReport() {
    $('#modal_Summary').modal('show');
    this.dataLoading = true;
    //this.SummaryReport = [];

    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.dailysell.ToDate),
      EmployeeId: this.SalesMan.EmployeeId
    }

    this.service.getSaleSummaryReport(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SaleSummaryReport = response.SaleSummaryReport;
        //this.SummaryReport.push(this.SaleSummaryReport);

      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  exportToExcel1() {
    $('#modal_Summary').modal('hide');
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.SaleSummaryReport.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table2, "SalesMan_Report" + this.loadDataService.loadDateTime(new Date()));
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


  SellTotal: any = {};
  getDailySellList() {
    this.SellTotal.DiscountAmount = 0;
    this.SellTotal.TotalProductAmount = 0;
    this.SellTotal.TotalCharges = 0;
    this.SellTotal.TaxableAmount = 0;
    this.SellTotal.CGSTAmount = 0;
    this.SellTotal.SGSTAmount = 0;
    this.SellTotal.IGSTAmount = 0;
    this.SellTotal.NetAmount = 0;
    this.SellTotal.RoundOff = 0;
    this.SellTotal.GrandTotal = 0;
    this.SellTotal.DuesAmount = 0;

    this.dataLoading = true;

    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.dailysell.ToDate),
      EmployeeId: this.SalesMan.EmployeeId,
      ShopId: this.SalesMan.ShopId
    }

    this.service.getDailySellList(obj).subscribe(r1 => {
    console.log("API Response 👉", obj);

      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.DailySellList = response.DailySellList;
        this.DailySellList.forEach((e1: any) => {
          this.SellTotal.DiscountAmount = 0;
          this.SellTotal.TotalProductAmount = 0;
          this.SellTotal.TotalCharges += e1.TotalCharges;
          this.SellTotal.TaxableAmount += e1.TaxableAmount;
          this.SellTotal.CGSTAmount += e1.CGSTAmount;
          this.SellTotal.SGSTAmount += e1.SGSTAmount;
          this.SellTotal.IGSTAmount += e1.IGSTAmount;
          this.SellTotal.NetAmount += e1.NetAmount;
          this.SellTotal.RoundOff += e1.RoundOff;
          this.SellTotal.GrandTotal += e1.GrandTotal;
          this.SellTotal.DuesAmount += e1.DuesAmount;
        });
       console.log("Final Total 👉", this.SellTotal);

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
    getPaymentModeName(id: number): string {
    const mode = this.paymentModes.find(x => x.Key === id);
    return mode ? mode.Value : '';
  }


getPaymentModeText(mode: any): string {
  if (!mode || mode === 0) return 'Cash';

  switch (+mode) {
    case 1: return 'Cash';
    case 2: return 'Online';
    case 3: return 'Paytm';
    default: return 'Unknown';
  }
}

}



