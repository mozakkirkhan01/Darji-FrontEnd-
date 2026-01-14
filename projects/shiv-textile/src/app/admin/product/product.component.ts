import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  Product: any = {};
  employeeDetail: any;
  StatusList = ConstantData.StatusList;
  ProductList: any[];
  dataLoading: boolean = false;
  submitted: boolean;
  Search: string;
  reverse: boolean;
  sortKey: string;
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  CategoryList: any = [];
  UnitList: any = [];
  SizeList: any = [];


  constructor(
    private service: AppService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.getCategoryList();
    // this.getSizeList();
    this.getUnitList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }
    this.Product = {};
    this.Product.Status = "1";
    this.Product.UnitId = "";
    this.Product.CategoryId = "";
    this.Product.SizeId = "";

    this.submitted = false;
  }

  newProduct(form: NgForm) {
    this.resetForm(form);
    $('#modal_popUp').modal('show');
  }

  editProduct(obj: any) {
    this.Product = obj;
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

  //ProductStockList: any[] = [];
  getProductStockList(Product: any) {
    if(Product.ProductStockList.length > 0){
      Product.ProductStockList = [];
      return;
    }
    this.dataLoading = true;
    this.service.getProductStockList({ ProductId: Product.ProductId }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        //this.ProductStockList = response.ProductStockList;
        Product.ProductStockList = response.ProductStockList;
        if(Product.ProductStockList.length == 0){
          toastr.warning("No stock is available");
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

  ProductTotal: any = {};
  getProductList() {
    this.ProductTotal.Quantity = 0;
    this.dataLoading = true;
    this.service.getProductList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductList = response.ProductList;
        this.ProductList.forEach((e1: any) => {
          this.ProductTotal.Quantity += e1.Quantity;
          e1.ProductStockList = [];
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

  saveProduct(form: NgForm) {
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
        this.getProductList();
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

  deleteProduct(obj: any) {
    if (confirm("Are you sure want to delete this record") == true) {
      this.dataLoading = true;
      this.service.deleteProduct(obj).subscribe(r1 => {
        let response = r1 as any;
        if (response.Message == ConstantData.SuccessMessage) {
          toastr.success("One record deleted successfully.");
          this.getProductList();
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


