import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent implements OnInit {

  employeeDetail: any;
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
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.loadingProductStock = true;
    this.getProductStockDetailList();
    this.setupSearchListener();
    //this.getProductStockHistoryList();
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  ProductStockList: any[] = [];
  AllProductStockList: any[] = [];

  // getProductStockDetailList() {
  //   var obj = {
  //     //Status: 1,
  //     //ShopId: this.Sell.ShopId
  //   }
  //   this.dataLoading = true;
  //   this.service.getOnlyProductStockList(obj).subscribe(r1 => {
  //     let response = r1 as any;
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.ProductStockList = response.ProductStockList;
  //       this.ProductStockList.map(c1 => c1.SearchProduct = `${c1.StockCode} - ${c1.ProductName} - ${c1.SizeName} - ${c1.HSNCode}`)
  //     } else {
  //       toastr.error(response.Message);
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     toastr.error("Error Occured while fetching data.");
  //     this.dataLoading = false;
  //   }));
  // }
  private searchSubject = new Subject<string>();
  setupSearchListener() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm: string) => {
      this.performFilter(searchTerm);
    });
  }

  loadingProductStock = false;
  getProductStockDetailList() {
    this.loadingProductStock = true;
    const obj = {};

    this.service.getOnlyProductStockList(obj).subscribe(
      (response: any) => {
        if (response.Message === 'Success') {
          this.AllProductStockList = response.OnlyProductStockList.map((x: any) => ({
            ...x,
            SearchProduct: `${x.StockCode} - ${x.ProductName} - ${x.SizeName} - ${x.HSNCode}`,
          }));
          this.ProductStockList = [...this.AllProductStockList];
        } else {
          toastr.error(response.Message);
        }
        this.loadingProductStock = false;
      },
      () => {
        toastr.error('Error occurred while fetching data.');
        this.loadingProductStock = false;
      }
    );
  }

  // afterProductStockSelected(item: any) {
  //  this.SellProduct.ProductStockId = item.ProductStockId;
  //  this.getProductStockHistoryList();

  // }

  filterPatientList(value: string) {
    this.searchSubject.next(value);
  }

  performFilter(searchTerm: string) {
    if (!searchTerm) {
      this.ProductStockList = [...this.AllProductStockList];
      return;
    }
    const filterValue = searchTerm;
    var pro = this.ProductStockList.filter(x1 => x1.StockCode == filterValue);
    if (pro.length > 0) {
      this.getProductStockHistoryList(pro[0].ProductStockId);
    } else if (filterValue.length > 3) {
      this.ProductStockList = [];
      for (let i = 0; i < this.AllProductStockList.length; i++) {
        const e1 = this.AllProductStockList[i];
        if (e1.SearchProduct.includes(filterValue))
          this.ProductStockList.push(e1)
      }
      // this.ProductStockList = this.ProductStockList.filter((option) =>
      //   option.SearchProduct.includes(filterValue)
      // );
    }


  }

  // Clear search and reset product stock list
  clearPatient() {
    this.ProductStockList = [...this.AllProductStockList];
    this.SellProduct = { ProductStockId: null, ProductName: '' };
  }

  afterPatientSelected(event: any) {
    try {
      // Wait for the product data to be fetched
      this.getProductStockHistoryList(event.option.id);

      // Use the first product from the result
      //const selectedProduct = this.AllselectedProduct[0];

      // Exit early if no product is found
      //if (!selectedProduct) return;

      // Check if the product already exists in the SellProductList
      // const existingProduct = this.SellProductList?.find(
      //   (product) => product.ProductStockId === selectedProduct.ProductStockId
      // );

      // if (existingProduct) {
      //   existingProduct.Quantity += 1;
      //   this.changeSellingPrice(existingProduct);
      // } else {
      //   this.SellProduct = {
      //     ...selectedProduct,
      //     Quantity: 1, 
      //     DiscountPercentage: selectedProduct.DiscountPercentage || 0, 
      //   };

      //   this.changeSellingPrice(this.SellProduct);

      // }

    } catch (error) {
      console.error('Error during product selection:', error);
    }
  }

  clearProductStock() {
    this.SellProduct.ProductId = 0;
  }

  SellProduct: any = {};
  ProductStockHistoryList: any[] = [];
  getProductStockHistoryList(ProductStockId: number) {
    var obj = {
      ProductStockId: ProductStockId
    }
    this.dataLoading = true;
    this.service.getProductStockHistoryList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockHistoryList = response.ProductStockHistoryList;
        // this.ProductStockHistoryList.forEach((e1: any) => {
        //   this.ProductTotal.Quantity += e1.Quantity;
        // });
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
