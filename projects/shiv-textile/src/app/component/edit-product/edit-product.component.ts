import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  Product: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  dataLoading: boolean = false;
  submitted: boolean;
  CategoryList: any = [];
  UnitList: any = [];
  SizeList: any = [];
  Search: string;
  reverse: boolean;
  sortKey: string;
  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  @Output() refreshProduct = new EventEmitter<number>();
  @ViewChild('formProductElement') formProductElement: ElementRef;

  constructor(
    private service: AppService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
    // this.getSizeList();
    this.getUnitList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.Product.Status = "1";
    this.Product.UnitId = "";
    this.Product.CategoryId = "";
    this.Product.SizeId = "";
  }

  resetForm(form?: NgForm) {
    if (form != null){
      form.reset();
    }
    this.Product.ProductName = null;
    this.Product.DesignNo = null;
    this.Product.DiscountPercentage = null;
    this.Product.CategoryId = "";
    this.Product.UnitId = "";
    this.Product.Status = "";
    this.Product.HSNCode = null;
    this.submitted = false;
  }

  getUnitList() {
    this.dataLoading = true;
    this.service.getUnitList({ UnitParentId: 0 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.UnitList = response.UnitList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getCategoryList() {
    this.dataLoading = true;
    this.service.getCategoryList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.CategoryList = response.CategoryList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

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
  TempProductList: any[] = [];
  saveProduct(form: NgForm, isReset: Boolean) {
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    this.Product.UpdatedBy = this.employeeDetail.EmployeeId;
    this.dataLoading = true;
    this.service.saveProduct(this.Product).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        this.refreshProduct.emit(response.ProductId);
        var obj = {
          CategoryName: null,
          UnitName: null,
          CompanyName: this.Product.CompanyName,
          DesignNo: this.Product.DesignNo,
          StatusName: '',
          Status: this.Product.Status,
          ProductName: this.Product.ProductName,
          DiscountPercentage: this.Product.DiscountPercentage,
          HSNCode: this.Product.HSNCode,
        }
        for (let i1 = 0; i1 < this.CategoryList.length; i1++) {
          const e1 = this.CategoryList[i1];
          if (e1.CategoryId == this.Product.CategoryId) {
            obj.CategoryName = e1.CategoryName;
            break;
          }
        }
        for (let i1 = 0; i1 < this.UnitList.length; i1++) {
          const e1 = this.UnitList[i1];
          if (e1.UnitId == this.Product.UnitId) {
            obj.UnitName = e1.UnitName;
            break;
          }
        }

        for (let i1 = 0; i1 < this.StatusList.length; i1++) {
          const e1 = this.StatusList[i1];
          if (e1.Key == this.Product.Status) {
            obj.StatusName = e1.Value;
            break;
          }
        }

        this.TempProductList.push(obj);
        if (isReset)
          this.resetForm(form);
        else {
          this.submitted = false;
          this.Product.ProductName = null;
          this.Product.DesignNo = null;
          const ele = this.formProductElement.nativeElement['ProductName'];
          if (ele)
            ele.focus();
        }

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
