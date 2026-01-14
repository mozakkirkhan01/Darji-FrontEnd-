import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { LoadDataService } from '../../utils/load-data.service';

@Component({
  selector: 'app-gr-list',
  templateUrl: './gr-list.component.html',
  styleUrls: ['./gr-list.component.css']
})
export class GrListComponent implements OnInit {

  employeeDetail: any;
  sell: any = {};
  GoodsReturnList: any[];
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
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.sell.FromDate = this.loadDataService.loadDateYMD(new Date());
    this.sell.ToDate = this.loadDataService.loadDateYMD(new Date());
    this.getGoodsReturnList();
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
  getGoodsReturnList() {
    var obj = {
      FromDate: this.loadDataService.loadDateYMD(this.sell.FromDate),
      ToDate: this.loadDataService.loadDateYMD(this.sell.ToDate),
    }

    this.dataLoading = true;
    this.service.getGoodsReturnList(this.sell).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.GoodsReturnList = response.GoodsReturnList;
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
          this.getGoodsReturnList();
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

}
