import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-transfer-sv-list',
  templateUrl: './transfer-sv-list.component.html',
  styleUrls: ['./transfer-sv-list.component.css']
})
export class TransferSvListComponent implements OnInit {
  employeeDetail: any;
  TransferSVList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean=true;
  sortKey: string='InvoiceDate';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTransferSVList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  editTransferToSV(Transfer: any) {
    this.router.navigate(['/admin/transfer-product-to-sv'], { queryParams: { id: Transfer.TransferId,redUrl:'/admin/transfer-sv-list' } });
  }

  transfer: any = {};
  transferProductList: any[] = [];
  getTransferToSVDetail(purchaseModel: any) {
    this.dataLoading = true;
    this.service.getTransferToSVDetail(purchaseModel).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.transfer = response.transfer;
        this.transferProductList = response.transferProductList;
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

  PurchaseTotal: any = {};
  getTransferSVList() {
   
    this.dataLoading = true;
    this.service.getTransferSVList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransferSVList = response.TransferSVList;
        
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
          this.getTransferSVList();
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
