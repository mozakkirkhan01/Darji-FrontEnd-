import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { LoadDataService } from '../../utils/load-data.service';
@Component({
  selector: 'app-sell-list',
  templateUrl: './sell-list.component.html',
  styleUrls: ['./sell-list.component.css']
})
export class SellListComponent implements OnInit {
  employeeDetail: any;
  sell: any = {};
  SellList: any[];
  paymentModes = ConstantData.PaymentModeList;
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean = true;
  sortKey: string = 'InvoiceDate';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];


  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sell.FromDate = this.loadDataService.loadDateYMD(new Date());
    this.sell.ToDate = this.loadDataService.loadDateYMD(new Date());
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.sell.ShopId = this.employeeDetail.ShopId;
    this.getSellList();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  editSell(Sell: any) {
    this.router.navigate(['/admin/sell'], { queryParams: { id: Sell.SellId, redUrl: '/admin/sell-list' } });
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
  getSellList() {
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

    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.sell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.sell.ToDate),
      ShopId: this.sell.ShopId
    }

    this.dataLoading = true;
    this.service.getSellList(this.sell).subscribe(r1 => {
      let response = r1 as any;
      console.log(response);

      if (response.Message == ConstantData.SuccessMessage) {
        this.SellList = response.SellList;
        this.SellList.forEach((e1: any) => {
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
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  deleteSell(obj: any) {
    if (confirm("Are you sure want to delete this record") == true) {
      this.dataLoading = true;
      this.service.deleteSell(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          toastr.success("One record deleted successfully.");
          this.getSellList();
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


  printInvoice(obj: any) {

    if (obj.OldSellId == obj.SellId) {
      this.service.printSellInvoice(obj.OldSellId);
    }
    else if (obj.NewSellId == obj.SellId) {
      this.service.printNewSellInvoice(obj.SellId);
    }
    else {
      this.service.printSellInvoice(obj.SellId);
    }
  }

  getPaymentModeName(id: number): string {
    const mode = this.paymentModes.find(x => x.Key === id);
    return mode ? mode.Value : '';
  }

}


