import { Component, OnInit } from '@angular/core';
// import { NgForm } from "@angular/forms";
// declare var toastr: any;

// import { AppService } from "../../utils/app.service";
// import { ConstantData } from "../../utils/constant-data";
// import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent {
  // Product: any = {};
  // employeeDetail: any;
  // StatusList = ConstantData.StatusList;
  // dataLoading: boolean = false;
  // submitted: boolean;
  // CategoryList:any =[];
  // UnitList:any=[];
  // SizeList:any=[];


  constructor(
    // private service: AppService,
    // private localService: LocalService
  ) { }

  // ngOnInit(): void {
  //   this.getCategoryList();
  //   this.getSizeList();
  //   this.getUnitList();
  //   this.employeeDetail = this.localService.getEmployeeDetail();
  //   this.Product.Status = "1";
  //   this.Product.UnitId = "";
  //   this.Product.CategoryId = "";
  //   this.Product.SizeId = "";
  // }

  // resetForm(form?: NgForm) {
  //   // if (form != null){
  //   //   form.reset();
  //   // }
  //   this.Product.ProductName  = null;
  //   this.Product.DesignNo = null;
  //   this.Product.DiscountPercentage = null;
  //   this.Product.HSNCode = null;
  //   this.submitted = false;
  // }
  
  // getUnitList() {
  //   this.dataLoading = true;
  //   this.service.getUnitList({UnitParentId:0}).subscribe(r1 => {
  //     let response = r1 as any;
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.UnitList = response.UnitList;
  //     } else {
  //       toastr.error(response.Message);
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     toastr.error("Error Occured while fetching data.");
  //     this.dataLoading = false;
  //   }));
  // }

  // getCategoryList() {
  //   this.dataLoading = true;
  //   this.service.getCategoryList({}).subscribe(r1 => {
  //     let response = r1 as any;
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.CategoryList = response.CategoryList;
  //     } else {
  //       toastr.error(response.Message);
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     toastr.error("Error Occured while fetching data.");
  //     this.dataLoading = false;
  //   }));
  // }

  // getSizeList() {
  //   this.dataLoading = true;
  //   this.service.getSizeList({}).subscribe(r1 => {
  //     let response = r1 as any;
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.SizeList = response.SizeList;
  //     } else {
  //       toastr.error(response.Message);
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     toastr.error("Error Occured while fetching data.");
  //     this.dataLoading = false;
  //   }));
  // }

  // saveProduct(form:NgForm) {
  //   this.submitted = true;
  //   if (form.invalid) {
  //     toastr.warning("Fill all the Required Fields.", "Invailid Form")
  //     this.dataLoading = false;
  //     return;
  //   }
  //   this.Product.UpdatedBy = this.employeeDetail.EmployeeId;
  //   this.dataLoading = true;
  //   this.service.saveProduct(this.Product).subscribe(r1 => {
  //     let response = r1 as any;
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       toastr.success("One record created successfully.", "Operation Success");
  //       this.resetForm(form);
  //     } else {
  //       toastr.error(response.Message);
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     toastr.error("Error Occured while fetching data.");
  //     this.dataLoading = false;
  //   }));
  // }
}



