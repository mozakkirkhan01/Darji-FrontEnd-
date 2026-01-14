import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  Employee: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  EmployeeList: any = [];
  EmployeeTypeList: any = [];
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
    this.getShopList();
    this.getEmployeeList();
    this.getEmployeeTypeList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetForm();
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
      if (e.ShopId == this.Employee.ShopId) {
        this.Employee.Address = e.Address;
        break;
      }
      else{
        this.Employee.Address = '';
      }
    }
  }


  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }
    this.submitted = false;
    this.Employee = {};
    this.Employee.Status = "1";
    this.Employee.EmployeeType = "";
    this.Employee.ShopId = "";
  }

  newEmployee(form: NgForm) {
    this.resetForm(form);
    $('#modal_popUp').modal('show');
  }

  editEmployee(obj: any) {
    this.Employee = obj;
    $('#modal_popUp').modal('show');
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getEmployeeTypeList() {
    this.dataLoading = true;
    this.service.getEmployeeTypeList().subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.EmployeeTypeList = response.EmployeeTypeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getEmployeeList() {
    this.dataLoading = true;
    this.service.getEmployeeList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.EmployeeList = response.EmployeeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  saveEmployee(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    this.Employee.UpdatedBy = this.employeeDetail.EmployeeId;
    this.dataLoading = true;
    this.service.saveEmployee(this.Employee).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.getEmployeeList();
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

  deleteEmployee(obj: any) {
    if (confirm("Are you sure want to delete this record") == true) {
      this.dataLoading = true;
      this.service.deleteEmployee(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          toastr.success("One record deleted successfully.");
          this.getEmployeeList();
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
