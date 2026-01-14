import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { OrderModule } from "ngx-order-pipe";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppService } from "./utils/app.service";
import { AppComponent } from './app.component';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { CategoryComponent } from './admin/category/category.component';
import { SizeComponent } from './admin/size/size.component';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { UnitComponent } from './admin/unit/unit.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { ProgressComponent } from './component/progress/progress.component';
import { HeadComponent } from './admin/head/head.component';
import { ProductComponent } from './admin/product/product.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
import { PurchaseComponent } from './admin/purchase/purchase.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditProductComponent } from './component/edit-product/edit-product.component';
import { PurchaseListComponent } from './admin/purchase-list/purchase-list.component';
import { ProductStockListComponent } from './admin/product-stock-list/product-stock-list.component';
import { BarCodePrintComponent } from './admin/bar-code-print/bar-code-print.component';
import { SellComponent } from './admin/sell/sell.component';
import { EditCustomerComponent } from './component/edit-customer/edit-customer.component';
import { SellListComponent } from './admin/sell-list/sell-list.component';
import { ReturnSellProductComponent } from './admin/return-sell-product/return-sell-product.component';
import { CustomerListComponent } from './admin/customer-list/customer-list.component';
import { DailysellListComponent } from './admin/dailysell-list/dailysell-list.component';
import { SupplierPaymentDetailComponent } from './admin/supplier-payment-detail/supplier-payment-detail.component';
import { SellReturnListComponent } from './admin/sell-return-list/sell-return-list.component';
import { SupplierPaymentComponent } from './admin/supplier-payment/supplier-payment.component';
import { SupplierPaymentHistoryComponent } from './admin/supplier-payment-history/supplier-payment-history.component';
import { DirectSellComponent } from './admin/direct-sell/direct-sell.component';
import { BarcodePrintbyInvoiceComponent } from './admin/barcode-printby-invoice/barcode-printby-invoice.component';
import { TransferProductToSVComponent } from './admin/transfer-product-to-sv/transfer-product-to-sv.component';
import { TransferSvListComponent } from './admin/transfer-sv-list/transfer-sv-list.component';
import { DirectSellListComponent } from './admin/direct-sell-list/direct-sell-list.component';
import { TransferSVDetailComponent } from './admin/transfer-svdetail/transfer-svdetail.component';
import { TransferProductToSTComponent } from './admin/transfer-product-to-st/transfer-product-to-st.component';
import { StockHistoryComponent } from './admin/stock-history/stock-history.component';
import { DirectSellReturnComponent } from './admin/direct-sell-return/direct-sell-return.component';
import { DirectSellReturnDetailComponent } from './admin/direct-sell-return-detail/direct-sell-return-detail.component';
import { SellGstReportComponent } from './admin/sell-gst-report/sell-gst-report.component';
import { DailyDirectSellReportComponent } from './admin/daily-direct-sell-report/daily-direct-sell-report.component';
import { ReturnGstReportComponent } from './admin/return-gst-report/return-gst-report.component';
import { DirectSellGstReportComponent } from './admin/direct-sell-gst-report/direct-sell-gst-report.component';
import { DirectReturnGstReportComponent } from './admin/direct-return-gst-report/direct-return-gst-report.component';
import { MergeSellListComponent } from './admin/merge-sell-list/merge-sell-list.component';
import { MergeReturnListComponent } from './admin/merge-return-list/merge-return-list.component';
import { GoodsReturnComponent } from './admin/goods-return/goods-return.component';
import { GrListComponent } from './admin/gr-list/gr-list.component';
import { PrintGoodsReturnComponent } from './admin/print-goods-return/print-goods-return.component';
import { GrDataReportComponent } from './admin/gr-data-report/gr-data-report.component';
import { ProductBarcodeComponent } from './admin/product-barcode/product-barcode.component';
import { MergeSellproductComponent } from './admin/merge-sellproduct/merge-sellproduct.component';
import { SellDaybookComponent } from './admin/sell-daybook/sell-daybook.component';
import { SellListByCustomerComponent } from './admin/sell-list-by-customer/sell-list-by-customer.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminMasterComponent,
    AdminDashboardComponent,
    PageNotFoundComponent,
    CategoryComponent,
    SizeComponent,
    SupplierComponent,
    UnitComponent,
    EmployeeComponent,
    AdminLoginComponent,
    ProgressComponent,
    HeadComponent,
    ProductComponent,
    NewProductComponent,
    PurchaseComponent,
    EditProductComponent,
    PurchaseListComponent,
    ProductStockListComponent,
    BarCodePrintComponent,
    SellComponent,
    EditCustomerComponent,
    SellListComponent,
    ReturnSellProductComponent,
    CustomerListComponent,
    DailysellListComponent,
    SupplierPaymentDetailComponent,
    SellReturnListComponent,
    SupplierPaymentComponent,
    SupplierPaymentHistoryComponent,
    DirectSellComponent,
    BarcodePrintbyInvoiceComponent,
    TransferProductToSVComponent,
    TransferSvListComponent,
    DirectSellListComponent,
    TransferSVDetailComponent,
    TransferProductToSTComponent,
    StockHistoryComponent,
    DirectSellReturnComponent,
    DirectSellReturnDetailComponent,
    SellGstReportComponent,
    DailyDirectSellReportComponent,
    ReturnGstReportComponent,
    DirectSellGstReportComponent,
    DirectReturnGstReportComponent,
    MergeSellListComponent,
    MergeReturnListComponent,
    GoodsReturnComponent,
    GrListComponent,
    PrintGoodsReturnComponent,
    GrDataReportComponent,
    ProductBarcodeComponent,
    MergeSellproductComponent,
    SellDaybookComponent,
    SellListByCustomerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    OrderModule,
    Ng2SearchPipeModule,
    AutocompleteLibModule,
    BrowserAnimationsModule,
    MatAutocompleteModule
  ],
  providers: [AppService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
