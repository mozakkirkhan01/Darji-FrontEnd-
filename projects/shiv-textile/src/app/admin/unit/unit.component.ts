import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  Unit: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  UnitList: any = [];
  ParentUnitList: any = [];
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
    this.getUnitList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetForm();
    this.Unit.Status = "1";
    this.Unit.UnitParentId = "";
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }
    this.submitted = false;
    this.Unit = {};
    this.Unit.Status = "1";
    this.Unit.UnitParentId = "";
  }

  newUnit() {
    this.resetForm();
    $('#modal_popUp').modal('show');
  }

  editUnit(obj: any) {
    this.Unit = obj;
    $('#modal_popUp').modal('show');
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getUnitList() {
    this.dataLoading = true;
    this.service.getUnitList({ UnitParentId: 0 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.UnitList = response.UnitList;
        this.ParentUnitList = [];
        this.UnitList.forEach((e1: any) => {
          if (e1.UnitParentId == null)
            this.ParentUnitList.push(e1);
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

  saveUnit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    this.Unit.UpdatedBy = this.employeeDetail.EmployeeId;
    this.dataLoading = true;
    this.service.saveUnit(this.Unit).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.getUnitList();
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

  deleteUnit(obj: any) {
    if (confirm("Are you sure want to delete this record") == true) {
      this.dataLoading = true;
      this.service.deleteUnit(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          toastr.success("One record deleted successfully.");
          this.getUnitList();
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

