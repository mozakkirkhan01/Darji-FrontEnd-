import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  employeeDetail: any;
  CustomerList: any[];
  dataLoading: boolean = false;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  constructor(
    private service: AppService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCustomerList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  getCustomerList() {
   
    this.dataLoading = true;
    this.service.getCustomerList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.CustomerList = response.CustomerList;
        console.log("List",this.CustomerList);

      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  saveCustomerList() {

  // basic validation
  if (!this.selectedCustomer.CustomerName || !this.selectedCustomer.MobileNo) {
    toastr.error('Customer Name and Mobile No are required');
    return;
  }

  // attach UpdatedBy from logged-in user
  this.selectedCustomer.UpdatedBy = this.employeeDetail?.EmployeeId || 0;

  this.dataLoading = true;

  this.service.saveCustomerList(this.selectedCustomer)
    .subscribe((res: any) => {

      if (res.Message === ConstantData.SuccessMessage) {
        toastr.success(
          this.selectedCustomer.CustomerId > 0
            ? 'Customer updated successfully'
            : 'Customer saved successfully'
        );

        // close modal
         $('#modal_popUp').modal('hide');

        // reset form
        this.resetForm();

        // refresh list
        this.getCustomerList();
      } else {
        toastr.error(res.Message);
      }

      this.dataLoading = false;

    }, err => {
      toastr.error('Error occurred while saving customer');
      this.dataLoading = false;
    });
}


  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  
resetForm() {
  this.selectedCustomer = {};
}

  
  selectedCustomer: any = {};
  
  editCustomerList(model: any) {
    this.selectedCustomer = { ...model }; // clone selected row
  }

}
