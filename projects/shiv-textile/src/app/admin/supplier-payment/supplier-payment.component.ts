import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-supplier-payment',
  templateUrl: './supplier-payment.component.html',
  styleUrls: ['./supplier-payment.component.css']
})
export class SupplierPaymentComponent implements OnInit {
  Purchase: any = {};
  payment: any = {};
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  SupplierList: any = [];
  myControl = new FormControl();
  PartyTypeList: any = [];
  SelectedSupplier: any = {};
  SupplierPaymentDetail: any = [];
  PaymentStatusList: any = [];
  PaymentModeList: any = [];
  SupplierPaymentList: any = [];
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  redUrl: string;
  ngOnInit(): void {
    this.resetForm();
    this.getSupplierList();
    this.getPaymentStatusList();
    this.getPaymentModeList();
    this.getSupplierPaymentList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  resetForm() {
    this.SelectedSupplier = {};
    this.SelectedSupplier.CompanyName = null;
    this.SelectedSupplier.ContactPersonName = null;
    this.SelectedSupplier.MobileNo = null;
    this.SelectedSupplier.GSTNo = null;
    this.payment = {};
    this.payment.PaymentDate = this.loadDataService.loadDateYMD(new Date());
    this.payment.PaymentMode = "";
    this.payment.Status = "";
    this.dataLoading = false;
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  afterSupplierSelected(item: any) {
    this.Purchase.SupplierId = item.SupplierId;
    this.SelectedSupplier = item;
    //this.getSupplierPaymentDetail();
  }

  clearSupplier() {
    this.Purchase.SupplierId = null;
  }

  getSupplierPaymentList() {
    this.dataLoading = true;

    this.service.getSupplierPaymentList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SupplierPaymentList = response.SupplierPaymentList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getSupplierList() {
    this.dataLoading = true;
    this.service.getSupplierList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SupplierList = response.SupplierList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getPaymentStatusList() {
    this.dataLoading = true;
    this.service.getPaymentStatusList().subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PaymentStatusList = response.PaymentStatusList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getPaymentModeList() {
    this.dataLoading = true;
    this.service.getPaymentModeList().subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PaymentModeList = response.PaymentModeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  SaveSupplierPayment(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    var obj = {
      SupplierId: this.SelectedSupplier.SupplierId,
      SupplierPaymentId: this.payment.SupplierPaymentId,
      TotalAmount: this.payment.TotalAmount,
      PaymentMode: this.payment.PaymentMode,
      TransactionDetail: this.payment.TransactionDetail,
      Remarks: this.payment.Remarks,
      Status: this.payment.Status,
      PaymentDate: this.loadDataService.loadDateYMD(this.payment.PaymentDate)
    }

    this.dataLoading = true;
    this.service.saveSupplierPayment(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.getSupplierPaymentList();
        this.resetForm();
      } else {
        toastr.error(response.Message);
        this.dataLoading = false;
      }
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  editPayment(obj: any) {
    this.payment = obj;
    this.payment.SupplierPaymentId = obj.SupplierPaymentId;
    this.Purchase.SupplierAutoCompleter = obj.CompanyName;
    this.payment.PaymentDate = this.loadDataService.loadDateYMD(obj.PaymentDate);
    this.SelectedSupplier = obj;
    $('#modal_popUp').modal('show');
  }

}
