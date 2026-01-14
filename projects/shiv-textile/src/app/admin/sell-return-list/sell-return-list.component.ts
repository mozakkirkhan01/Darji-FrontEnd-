import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
@Component({
  selector: 'app-sell-return-list',
  templateUrl: './sell-return-list.component.html',
  styleUrls: ['./sell-return-list.component.css']
})
export class SellReturnListComponent implements OnInit {
  employeeDetail: any;
  SellReturnList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  dailysell: any = {};
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
    this.getEmployeeList();
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

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  SalesMan: any = {};
  clearEmployee() {
    this.SalesMan.EmployeeId = "";
    //this.resetPurchaseProduct();
  }

  getEmployeeId(item: any) {
    this.SalesMan.EmployeeId = item.EmployeeId
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

  SellTotal: any = {};
  getSellReturnList() {
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

    this.dataLoading = true;

    var obj = {
      FromDate: this.loadDataService.loadDateYMDT(this.dailysell.FromDate),
      ToDate: this.loadDataService.loadDateYMDT(this.dailysell.ToDate),
      ShopId: this.SalesMan.ShopId,
      EmployeeId: this.SalesMan.EmployeeId
    }

    this.service.getSellReturnList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SellReturnList = response.SellReturnList;
        this.SellReturnList.forEach((e1: any) => {
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
    this.service.printSellInvoice(obj.ReturnSellId);
  }

  getNewBillPrint(obj: any) {
    this.service.printSellInvoice(obj.SellId);
  }

  getReturnBillPrint(obj: any) {
    this.service.printNewSellInvoice(obj.SellId);
  }

  printInvoice(id: any) {
    this.service.printSellInvoice(id);
  }

}
