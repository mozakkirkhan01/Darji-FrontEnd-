import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm } from "@angular/forms";
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from "../../utils/local.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  Purchase: any = {};
  employeeDetail: any;
  dataLoading: boolean = false;
  submitted: boolean;
  SupplierList: any = [];
  myControl = new FormControl();
  PartyTypeList: any = [];
  SelectedSupplier: any = {};
  ShopList: any = [];

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  redUrl: string;
  ngOnInit(): void {
    this.getPartyTypeList();
    this.getSupplierList();
    this.getProductList();
    this.getGSTList();
    this.getHeadList();
    this.getSizeList();
    this.getShopList();
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.resetPurchaseProduct();
    this.resetPurchaseCharge();
    this.resetForm();
    this.route.queryParams.subscribe((params: any) => {
      this.Purchase.PurchaseId = params.id;
      this.redUrl = params.redUrl;
      if (this.Purchase.PurchaseId > 0)
        this.getPurchaseDetail(this.Purchase.PurchaseId);
      else
        this.Purchase.PurchaseId = 0;
    });

    this.setFocus();

  }
  @ViewChild('myFormElement') myFormElement: ElementRef;
  @ViewChild('formProductElement') formProductElement: ElementRef;

  setFocus() {
    if (this.myFormElement) {
      const ele = this.myFormElement.nativeElement[0];
      if (ele)
        ele.focus();
    } else {
      setTimeout(() => {
        this.setFocus();
      }, 200);
    }
  }

  keyPress(event: any) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      if (event.currentTarget.name == 'InvoiceNo') {
        const ele = this.formProductElement.nativeElement[0];
        if (ele)
          ele.focus();
      } else if (event.currentTarget.name == 'Quantity') {
        const ele = this.formProductElement.nativeElement['addProduct'];
        if (ele)
          ele.focus();
      } else {
        const ele = this.formProductElement.nativeElement['SizeId'];
        if (ele)
          ele.focus();
      }
    }
  }

  ChangeSellingPrice() {
    this.PurchaseProduct.SellingPrice = this.PurchaseProduct.MRP
  }
  SizeList: any[] = [];
  getSizeList() {
    this.dataLoading = true;
    this.service.getSizeList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SizeList = response.SizeList;
        //this.SizeListTwo = response.SizeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  getPurchaseDetail(PurchaseId: number) {
    this.dataLoading = true;
    this.service.getPurchaseDetail({ PurchaseId: PurchaseId }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Purchase = response.Purchase;
        this.Purchase.InvoiceDate = this.loadDataService.loadDateYMD(this.Purchase.InvoiceDate);
        this.PurchaseChargeList = response.PurchaseChargeList;
        this.PurchaseProductList = response.PurchaseProductList;
        this.PurchaseProductList.map(x => x.SearchProduct = `${x.ProductName} - ${x.HSNCode}`);
        this.Purchase.SupplierAutoCompleter = this.Purchase.SupplierId;
        this.setSupplier();
        this.calculateTotal();
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  setSupplier() {
    if (this.SupplierList.length > 0) {
      for (let i1 = 0; i1 < this.SupplierList.length; i1++) {
        const e1 = this.SupplierList[i1];
        if (e1.SupplierId == this.Purchase.SupplierId) {
          this.SelectedSupplier = e1;
          break;
        }
      }
    } else {
      setTimeout(() => {
        this.setSupplier()
      }, 200);

    }

  }

  getSupplierList() {
    this.dataLoading = true;
    this.service.getSupplierList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SupplierList = response.SupplierList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  afterSupplierSelected(item: any) {
    this.Purchase.SupplierId = item.SupplierId;
    this.SelectedSupplier = item;

  }

  clearSupplier() {
    this.Purchase.SupplierId = null;

    this.ResetList();
  }

  changeSupplierText(text: any) {
    this.ClearPurchaseList();
  }

  getPartyTypeList() {
    this.dataLoading = true;
    this.service.getPartyTypeList().subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.PartyTypeList = response.PartyTypeList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

  removeData(list: any[], index: number) {
    list.splice(index, 1);
    this.calculateTotal();
  }

  //Purchase Product
  PurchaseProductList: any[] = [];
  //PurchaseProductSizeQty: any[] = [];
  ProductList: any[] = [];
  PurchaseProduct: any = {};
  GSTList: any[] = [];
  isProductSubmitted: boolean = false;

  resetPurchaseProduct() {
    this.PurchaseProduct = {};
    this.PurchaseProduct.GSTPercentage = 0;
    this.PurchaseProduct.UnitName = null;
    this.PurchaseProduct.SizeId = '';
    this.isProductSubmitted = false;
  }

  getGSTList() {
    this.dataLoading = true;
    this.service.getGSTList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.GSTList = response.GSTList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }


  getProductList(productId?: number) {
    this.dataLoading = true;
    this.service.getProductList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductList = response.ProductList;
        this.ProductList.map(c1 => c1.SearchProduct = `${c1.ProductName}  -  ${c1.DesignNo}  -  ${c1.HSNCode}`)
        if (productId != null) {
          for (let i = 0; i < this.ProductList.length; i++) {
            const e1 = this.ProductList[i];
            if (e1.ProductId == productId) {
              this.PurchaseProduct.ProductId = e1.ProductId;
              break;
            }
          }
          $('#modal_product').modal('hide');
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

  afterProductSelected(item: any) {
    this.PurchaseProduct.ProductId = item.ProductId;
    this.PurchaseProduct.ItemType = item.ItemType;
    this.PurchaseProduct.SearchProduct = item.SearchProduct;
    this.PurchaseProduct.UnitName = item.UnitName;
    const ele = this.formProductElement.nativeElement['SizeId'];
    if (ele)
      ele.focus();
    // if (item.DiscountPercentage > 0) {
    //   this.PurchaseProduct.DiscountPercentage = item.DiscountPercentage;
    // }
  }

  clearProduct() {
    this.PurchaseProduct.ProductId = 0;
    this.resetPurchaseProduct();
  }

  // IsEdit: boolean = false;

  changeGST(PurchaseProduct: any) {
    PurchaseProduct.IsEdit = true;
    this.changeCostPrice(PurchaseProduct)
  }

  changeCostPrice(PurchaseProduct: any) {
    PurchaseProduct.BasicAmount = this.loadDataService.round((PurchaseProduct.Quantity * PurchaseProduct.CostPrice), 2);
    PurchaseProduct.DiscountAmount = (PurchaseProduct.DiscountAmount == null ? 0 : PurchaseProduct.DiscountAmount);
    if (PurchaseProduct.DiscountPercentage != null) {
      PurchaseProduct.DiscountPercentage = PurchaseProduct.DiscountPercentage;
      PurchaseProduct.DiscountAmount = this.loadDataService.round(PurchaseProduct.BasicAmount * PurchaseProduct.DiscountPercentage / 100, 2);
    }
    PurchaseProduct.TaxableAmount = PurchaseProduct.BasicAmount - PurchaseProduct.DiscountAmount;
    PurchaseProduct.ItemType = PurchaseProduct.ItemType;
    //if (PurchaseProduct.PurchaseId == undefined) {
    this.setGST(PurchaseProduct);
    this.calculateGST(PurchaseProduct);
  };

  setGST(PurchaseProduct: any) {
    if (PurchaseProduct.IsEdit)
      return;
    if (PurchaseProduct.ItemType == 1) {
      if (PurchaseProduct.CostPrice < 1000)
        PurchaseProduct.GSTPercentage = 5;
      else
        PurchaseProduct.GSTPercentage = 12;
    }
    else {
      PurchaseProduct.GSTPercentage = 5;
    }
  }

  calculateGST(PurchaseProduct: any) {
    PurchaseProduct.TotalGSTAmount = 0;
    PurchaseProduct.CGSTAmount = 0;
    PurchaseProduct.SGSTAmount = 0;
    PurchaseProduct.IGSTAmount = 0;
    PurchaseProduct.GrossAmount = 0;

    if (this.Purchase.PartyType == 1) {
      if (PurchaseProduct.HeadId > 0) {
        PurchaseProduct.GSTPercentage = PurchaseProduct.GSTPercentage;
      }
      else {
        PurchaseProduct.GSTPercentage = PurchaseProduct.GSTPercentage;
        // if (PurchaseProduct.CostPrice < 1000)
        //   PurchaseProduct.GSTPercentage = 5;
        // else
        //   PurchaseProduct.GSTPercentage = 12;
      }

      if (this.Purchase.SupplierId > 0) {
        var gstCode = 0;
        if (this.SelectedSupplier.GSTNo != null) {
          gstCode = this.SelectedSupplier.GSTNo.substring(0, 2);
        }
        PurchaseProduct.TotalGSTAmount = this.loadDataService.round((PurchaseProduct.TaxableAmount * PurchaseProduct.GSTPercentage) / 100, 2);
        if (gstCode == 20) {
          PurchaseProduct.CGSTAmount = this.loadDataService.round(PurchaseProduct.TotalGSTAmount / 2, 2);
          PurchaseProduct.SGSTAmount = this.loadDataService.round(PurchaseProduct.TotalGSTAmount / 2, 2);
        } else {
          PurchaseProduct.IGSTAmount = PurchaseProduct.TotalGSTAmount;
        }
      }
    }
    PurchaseProduct.TotalGSTAmount = PurchaseProduct.CGSTAmount + PurchaseProduct.SGSTAmount + PurchaseProduct.IGSTAmount;
    PurchaseProduct.GrossAmount = this.loadDataService.round(PurchaseProduct.TaxableAmount + PurchaseProduct.TotalGSTAmount, 2);
    this.calculateTotal();
  }

  openSizeQty() {
    this.SizeListTwo = [];
    this.SizeList.forEach((e1: any) => {
      this.SizeListTwo.push({
        SizeId: e1.SizeId,
        SizeName: e1.SizeName,
        Quantity: null
      })
    });
    $('#modal_size').modal('show');
  }

  ClearPurchaseList() {
    if (this.PurchaseProductList.length > 0) {
      $('#modal_popUp').modal('show');
    }
  }

  ResetList() {
    //this.PurchaseProductSizeQty = [];
    this.PurchaseProductList = [];
    this.PrintProduct.TotalQuantity = 0;
    $('#modal_popUp').modal('hide');
  }

  changeDiscountAmount(purchaseProductModel: any) {
    purchaseProductModel.DiscountPercentage = purchaseProductModel.DiscountAmount * 100 / purchaseProductModel.BasicAmount;
    this.calculateGST(purchaseProductModel);
  }
  PrintProduct: any = {};
  addPurchaseProduct(form: NgForm, isReset: boolean) {
    this.isProductSubmitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }

    if (this.SizeListTwo.length == 0) {
      if (this.PurchaseProduct.SizeId > 0) {
        var obj = {
          StockCode: this.PurchaseProduct.StockCode,
          ItemType: this.PurchaseProduct.ItemType,
          IsEdit: this.PurchaseProduct.IsEdit,
          ProductId: this.PurchaseProduct.ProductId,
          SizeId: this.PurchaseProduct.SizeId,
          SizeName: null,
          SearchProduct: this.PurchaseProduct.SearchProduct,
          UnitName: this.PurchaseProduct.UnitName,
          MRP: this.PurchaseProduct.MRP,
          CostPrice: this.PurchaseProduct.CostPrice,
          SellingPrice: this.PurchaseProduct.SellingPrice,
          Quantity: this.PurchaseProduct.Quantity,
          TotalAmount: this.PurchaseProduct.TotalAmount,
          DiscountPercentage: this.PurchaseProduct.DiscountPercentage,
          DiscountAmount: this.PurchaseProduct.DiscountAmount,
          TaxableAmount: this.PurchaseProduct.TaxableAmount,
          GSTPercentage: this.PurchaseProduct.GSTPercentage,
          CGSTAmount: this.PurchaseProduct.CGSTAmount,
          SGSTAmount: this.PurchaseProduct.SGSTAmount,
          IGSTAmount: this.PurchaseProduct.IGSTAmount,
          GrossAmount: this.PurchaseProduct.GrossAmount,
        }

        for (let i1 = 0; i1 < this.SizeList.length; i1++) {
          const e1 = this.SizeList[i1];
          if (e1.SizeId == obj.SizeId) {
            obj.SizeName = e1.SizeName;
            break;
          }
        }
        this.PurchaseProductList.push(obj);
      }
    } else {

      for (let i = 0; this.SizeListTwo.length > i; i++) {
        const l1 = this.SizeListTwo[i];

        if (l1.Quantity > 0) {
          var obj2 = {
            StockCode: this.PurchaseProduct.StockCode,
            ItemType: this.PurchaseProduct.ItemType,
            IsEdit: this.PurchaseProduct.IsEdit,
            ProductId: this.PurchaseProduct.ProductId,
            SizeId: l1.SizeId,
            SizeName: l1.SizeName,
            SearchProduct: this.PurchaseProduct.SearchProduct,
            UnitName: this.PurchaseProduct.UnitName,
            MRP: this.PurchaseProduct.MRP,
            CostPrice: this.PurchaseProduct.CostPrice,
            SellingPrice: this.PurchaseProduct.SellingPrice,
            Quantity: l1.Quantity,
            TotalAmount: this.PurchaseProduct.TotalAmount,
            DiscountPercentage: this.PurchaseProduct.DiscountPercentage,
            DiscountAmount: this.PurchaseProduct.DiscountAmount,
            TaxableAmount: this.PurchaseProduct.TaxableAmount,
            GSTPercentage: this.PurchaseProduct.GSTPercentage,
            CGSTAmount: this.PurchaseProduct.CGSTAmount,
            SGSTAmount: this.PurchaseProduct.SGSTAmount,
            IGSTAmount: this.PurchaseProduct.IGSTAmount,
            GrossAmount: this.PurchaseProduct.GrossAmount,
          }
          //Calculation  
          this.changeCostPrice(obj2);

          this.PurchaseProductList.push(obj2);
        }
      }

    }
    if (isReset) {
      form.resetForm();
      this.resetPurchaseProduct();
      this.SizeListTwo = [];
    } else {
      this.PurchaseProduct.SizeId = '';
      this.SizeListTwo = [];
    }
    this.calculateTotal();
  }

  SizeListTwo: any = [];
  // addProductSizeQty(form: NgForm, isReset: boolean) {
  //   this.isProductSubmitted = true;
  //   if (form.invalid) {
  //     toastr.warning("Fill all the Required Fields.", "Invailid Form")
  //     this.dataLoading = false;
  //     return;
  //   }




  //   for (let i1 = 0; i1 < this.SizeListTwo.length; i1++) {
  //     const e1 = this.SizeListTwo[i1];
  //     var obj = {
  //       SizeId: this.PurchaseProduct.SizeId,
  //       SizeName: null,
  //       Quantity: this.PurchaseProduct.Quantity,
  //     }
  //     if (e1.SizeId == obj.SizeId) {
  //       obj.SizeName = e1.SizeName;
  //       break;
  //     }
  //     if (this.PurchaseProductSizeQty.length == 0)
  //       this.PurchaseProductSizeQty.push(obj);
  //     else
  //       this.PurchaseProductSizeQty.push(obj);

  //   }

  //   // if (isReset) {
  //   //   form.resetForm();
  //   //   this.resetPurchaseProduct();
  //   // } else {
  //   //   this.PurchaseProduct.SizeId = '';
  //   // }
  //   // this.calculateTotal();
  // }

  //PurchaseCharge
  PurchaseCharge: any = {};
  PurchaseChargeList: any[] = [];
  HeadList: any[] = [];
  isPurchaseChargeSubmitted: boolean = false;

  resetPurchaseCharge() {
    this.PurchaseCharge = {};
    this.PurchaseCharge.HeadId = "";
    this.PurchaseCharge.GSTPercentage = 0;
    this.isPurchaseChargeSubmitted = false;
  }

  getHeadList() {
    this.dataLoading = true;
    this.service.getHeadList({ Status: 1 }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.HeadList = response.HeadList;
      } else {
        toastr.error(response.Message);
      }
      this.dataLoading = false;
    }, (err => {
      toastr.error("Error Occured while fetching data.");
      this.dataLoading = false;
    }));
  }

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
      if (e.ShopId == this.Purchase.ShopId) {
        this.Purchase.Address = e.Address;
        break;
      }
      else {
        this.Purchase.Address = '';
      }
    }
  }

  addPurcaseCharge(form: NgForm) {
    this.isPurchaseChargeSubmitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }

    for (let i = 0; i < this.HeadList.length; i++) {
      const e1 = this.HeadList[i];
      if (e1.HeadId == this.PurchaseCharge.HeadId) {
        this.PurchaseCharge.HeadName = e1.HeadName;
        break;
      }
    }

    this.calculateGST(this.PurchaseCharge);
    var obj = {
      HeadId: this.PurchaseCharge.HeadId,
      HeadName: this.PurchaseCharge.HeadName,
      TaxableAmount: this.PurchaseCharge.TaxableAmount,
      GSTPercentage: this.PurchaseCharge.GSTPercentage,
      CGSTAmount: this.PurchaseCharge.CGSTAmount,
      SGSTAmount: this.PurchaseCharge.SGSTAmount,
      IGSTAmount: this.PurchaseCharge.IGSTAmount,
      GrossAmount: this.PurchaseCharge.GrossAmount,
    }
    this.PurchaseChargeList.push(obj);
    form.resetForm();
    this.resetPurchaseCharge();
    this.calculateTotal();
  }


  //Purchase
  calculateTotal() {
    this.Purchase.TotalProductAmount = 0;
    this.Purchase.DiscountAmount = 0;
    this.Purchase.TotalCharges = 0;
    this.Purchase.TaxableAmount = 0;
    this.Purchase.CGSTAmount = 0;
    this.Purchase.SGSTAmount = 0;
    this.Purchase.IGSTAmount = 0;
    this.Purchase.NetAmount = 0;
    this.Purchase.RoundOff = 0;
    this.Purchase.GrandTotal = 0;
    this.PrintProduct.TotalQuantity = 0;

    this.PurchaseProductList.forEach((e1: any) => {
      this.Purchase.TotalProductAmount += e1.GrossAmount;
      this.Purchase.DiscountAmount += e1.DiscountAmount;
      this.Purchase.TaxableAmount += e1.TaxableAmount;
      this.Purchase.CGSTAmount += e1.CGSTAmount;
      this.Purchase.SGSTAmount += e1.SGSTAmount;
      this.Purchase.IGSTAmount += e1.IGSTAmount;
      this.Purchase.NetAmount += e1.GrossAmount;
      this.PrintProduct.TotalQuantity += e1.Quantity
    });

    this.PurchaseChargeList.forEach((e1: any) => {
      this.Purchase.TotalCharges += e1.GrossAmount;
      this.Purchase.TaxableAmount += e1.TaxableAmount;
      this.Purchase.CGSTAmount += e1.CGSTAmount;
      this.Purchase.SGSTAmount += e1.SGSTAmount;
      this.Purchase.IGSTAmount += e1.IGSTAmount;
      this.Purchase.NetAmount += e1.GrossAmount;
    });
    this.Purchase.TotalCharges = this.loadDataService.round(this.Purchase.TotalCharges, 2);
    this.Purchase.TotalProductAmount = this.loadDataService.round(this.Purchase.TotalProductAmount, 2);
    this.Purchase.DiscountAmount = this.loadDataService.round(this.Purchase.DiscountAmount, 2);
    this.Purchase.CGSTAmount = this.loadDataService.round(this.Purchase.CGSTAmount, 2);
    this.Purchase.SGSTAmount = this.loadDataService.round(this.Purchase.SGSTAmount, 2);
    this.Purchase.IGSTAmount = this.loadDataService.round(this.Purchase.IGSTAmount, 2);
    this.Purchase.TaxableAmount = this.loadDataService.round(this.Purchase.TaxableAmount, 2);
    this.Purchase.NetAmount = this.loadDataService.round(this.Purchase.NetAmount, 2);
    this.Purchase.GrandTotal = this.loadDataService.round(this.Purchase.NetAmount);
    this.Purchase.RoundOff = this.loadDataService.round(this.Purchase.GrandTotal - this.Purchase.NetAmount, 2);
  }



  resetForm() {
    this.Purchase = {};
    this.Purchase.PurchaseId = 0;
    this.Purchase.Status = "1";
    this.Purchase.SupplierId = "";
    this.Purchase.PartyType = "";
    this.Purchase.ShopId = "";
    this.Purchase.InvoiceDate = this.loadDataService.loadDateYMD(new Date());
    this.submitted = false;
    this.PurchaseChargeList = [];
    this.PurchaseProductList = [];

    //$('#MobileNo').focus();
  }

  savePurchase(form: NgForm, form2: NgForm) {
    console.log(form);
    this.submitted = true;
    if (form.invalid) {
      toastr.warning("Fill all the Required Fields.", "Invailid Form")
      this.dataLoading = false;
      return;
    }
    var obj = {
      Purchase: this.Purchase,
      PurchaseChargeList: this.PurchaseChargeList,
      PurchaseProductList: this.PurchaseProductList,
      UpdatedBy: this.employeeDetail.EmployeeId
    }
    this.dataLoading = true;
    this.service.savePurchase(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        toastr.success("One record created successfully.", "Operation Success");
        if (this.redUrl)
          this.router.navigate([this.redUrl]);
        form.resetForm();
        form2.resetForm();
        this.resetForm();
        if (this.myFormElement) {
          const ele = this.myFormElement.nativeElement[0];
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
