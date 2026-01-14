import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";


@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {
  employeeDetail: any;
  PurchaseList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean = true;
  sortKey: string = 'InvoiceDate';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  ShopList: any = [];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getShopList();
    this.getPurchaseList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.Shop.ShopId = "";
  }

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

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  editPurchase(Purchase: any) {
    this.router.navigate(['/admin/purchase'], { queryParams: { id: Purchase.PurchaseId, redUrl: '/admin/purchase-list' } });
  }

  Purchase: any = {};
  PurchaseChargeList: any[] = [];
  PurchaseProductList: any[] = [];
  getPurchaseDetail(purchaseModel: any) {
    this.dataLoading = true;
    this.service.getPurchaseDetail(purchaseModel).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Purchase = response.Purchase;
        this.PurchaseChargeList = response.PurchaseChargeList;
        this.PurchaseProductList = response.PurchaseProductList;
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

  selectShopAddress() {

    for (let i = 0; i < this.ShopList.length; i++) {
      const e = this.ShopList[i];
      if (e.ShopId == this.Shop.ShopId) {
        this.Shop.Address = e.Address;
        break;
      }
      else {
        this.Shop.Address = '';
      }
    }
  }

  Shop: any = {};
  PurchaseTotal: any = {};
  getPurchaseList() {
    this.selectShopAddress();
    this.PurchaseTotal.DiscountAmount = 0;
    this.PurchaseTotal.TotalProductAmount = 0;
    this.PurchaseTotal.TotalCharges = 0;
    this.PurchaseTotal.TaxableAmount = 0;
    this.PurchaseTotal.CGSTAmount = 0;
    this.PurchaseTotal.SGSTAmount = 0;
    this.PurchaseTotal.IGSTAmount = 0;
    this.PurchaseTotal.NetAmount = 0;
    this.PurchaseTotal.RoundOff = 0;
    this.PurchaseTotal.GrandTotal = 0;
    var obj = {
      ShopId: this.Shop.ShopId
    }

    this.dataLoading = true;
    this.service.getPurchaseList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PurchaseList = response.PurchaseList;
        this.PurchaseList.forEach((e1: any) => {
          this.PurchaseTotal.DiscountAmount = 0;
          this.PurchaseTotal.TotalProductAmount = 0;
          this.PurchaseTotal.TotalCharges += e1.TotalCharges;
          this.PurchaseTotal.TaxableAmount += e1.TaxableAmount;
          this.PurchaseTotal.CGSTAmount += e1.CGSTAmount;
          this.PurchaseTotal.SGSTAmount += e1.SGSTAmount;
          this.PurchaseTotal.IGSTAmount += e1.IGSTAmount;
          this.PurchaseTotal.NetAmount += e1.NetAmount;
          this.PurchaseTotal.RoundOff += e1.RoundOff;
          this.PurchaseTotal.GrandTotal += e1.GrandTotal;
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

  deletePurchase(obj: any) {
    if (confirm("Are you sure want to delete this record") == true) {
      this.dataLoading = true;
      this.service.deletePurchase(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          toastr.success("One record deleted successfully.");
          this.getPurchaseList();
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

}



