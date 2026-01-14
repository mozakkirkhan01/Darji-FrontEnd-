import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { LoadDataService } from '../../utils/load-data.service';

@Component({
  selector: 'app-transfer-svdetail',
  templateUrl: './transfer-svdetail.component.html',
  styleUrls: ['./transfer-svdetail.component.css']
})
export class TransferSVDetailComponent implements OnInit {
  employeeDetail: any;
  TransferToSVDetailDateWise: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean=true;
  sortKey: string='InvoiceDate';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  dailyTransfer: any = {};

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getTransferToSVDetailDateWise();
    this.dailyTransfer.FromDate = this.loadDataService.loadDateYMD(new Date());
    this.dailyTransfer.ToDate = this.loadDataService.loadDateYMD(new Date());
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

  PurchaseTotal: any = {};
  getTransferToSVDetailDateWise() {
    var obj = {
      FromDate: (this.dailyTransfer.FromDate),
      ToDate: (this.dailyTransfer.ToDate)
    }
    this.dataLoading = true;
    this.service.getTransferToSVDetailDateWise(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransferToSVDetailDateWise = response.TransferToSVDetailDateWise;
        
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
