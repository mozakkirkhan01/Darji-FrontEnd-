import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";


@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  Customer: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  dataLoading: boolean = false;
  submitted: boolean;

  @Output() refreshCustomer = new EventEmitter<number>();


  constructor(
    private service: AppService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    this.Customer = {};
    this.Customer.Status = "1";
    this.submitted = false;
  }

  saveCustomer(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    this.Customer.UpdatedBy = this.employeeDetail.EmployeeId;
    this.dataLoading = true;
    this.service.saveCustomer(this.Customer).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.refreshCustomer.emit(response.CustomerId);
        this.resetForm(form);
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

