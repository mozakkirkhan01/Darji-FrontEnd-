import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;

import { AppService } from '../../utils/app.service';
import { LocalService } from "../../utils/local.service";
import { Router } from '@angular/router';
import { ConstantData } from "../../utils/constant-data";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  dataLoading: boolean;
  submitted: boolean;
  Employee: any = {};
  constructor(private service: AppService,
    private localService: LocalService,
    private router: Router) { }

  ngOnInit(): void {

  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.Employee = {};
    this.submitted = false;
  }

  employeeLogin(form : NgForm) {
    this.submitted = true;
    if (form.invalid) {
      toastr.error("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    
    this.dataLoading = true;
    this.service.employeeLogin(this.Employee).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("Login Successful.")
        this.submitted = false;
        this.localService.setEmployeeDetail(response.UserDetail)
        this.router.navigate(['/admin/admin-dashboard']);
      } else {
        toastr.error(response.Message);
        this.dataLoading = false;
      }
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }
}
