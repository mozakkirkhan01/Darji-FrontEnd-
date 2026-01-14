import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.css']
})
export class SizeComponent implements OnInit {
  Size: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  SizeList: any[];
  dataLoading: boolean = false;
  submitted: boolean;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];


  constructor(
    private service: AppService,
    private orderPipe: OrderPipe,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.getSizeList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    this.submitted = false;
    this.Size= {};
    this.Size.Status = "1";
    if (form != null){
      form.reset();
    }
  }

  newSize(form:NgForm) {
    this.resetForm(form);
    $('#modal_popUp').modal('show');
  }

  editSize(obj: any) {
    this.Size = obj;
    $('#modal_popUp').modal('show');
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getSizeList() {
    this.dataLoading = true;
    this.service.getSizeList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SizeList = response.SizeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  saveSize(form:NgForm) {
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    this.Size.UpdatedBy = this.employeeDetail.EmployeeId;
    this.dataLoading = true;
    this.service.saveSize(this.Size).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.getSizeList();
        $('#modal_popUp').modal('hide');
      } else {
        toastr.error(response.Message);
        this.dataLoading = false;
      }
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  deleteSize(obj: any) {
    if (confirm("Are you sure want to delete this record") == true) {
      this.dataLoading = true;
      this.service.deleteSize(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          toastr.success("One record deleted successfully.");
          this.getSizeList();
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


