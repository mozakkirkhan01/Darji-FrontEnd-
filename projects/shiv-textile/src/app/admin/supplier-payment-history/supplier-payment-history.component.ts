import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-supplier-payment-history',
  templateUrl: './supplier-payment-history.component.html',
  styleUrls: ['./supplier-payment-history.component.css']
})
export class SupplierPaymentHistoryComponent implements OnInit {
  employeeDetail: any;
  PartyPaymentList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean=true;
  sortKey: string='TotalPurchase';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPartyPaymentList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getPartyPaymentList() {
    this.dataLoading = true;
    this.service.getPartyPaymentList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PartyPaymentList = response.PartyPaymentList;
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
