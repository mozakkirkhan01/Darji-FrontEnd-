import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterComponent } from './admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { CategoryComponent } from './admin/category/category.component';
import { SizeComponent } from './admin/size/size.component';
import { SupplierComponent } from './admin/supplier/supplier.component';
import { UnitComponent } from './admin/unit/unit.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { HeadComponent } from './admin/head/head.component';
import { ProductComponent } from './admin/product/product.component';
import { NewProductComponent } from './admin/new-product/new-product.component';
import { PurchaseComponent } from './admin/purchase/purchase.component';
import { PurchaseListComponent } from './admin/purchase-list/purchase-list.component';
import { ProductStockListComponent } from './admin/product-stock-list/product-stock-list.component';
import { SellComponent } from './admin/sell/sell.component';
import { SellListComponent } from './admin/sell-list/sell-list.component';
import { BarCodePrintComponent } from './admin/bar-code-print/bar-code-print.component';
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

const routes: Routes = [
  { path: '', redirectTo: "admin-login", pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  {
    path: 'admin', component: AdminMasterComponent, children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'sell-daybook', component: SellDaybookComponent },
      { path: 'merge-sellproduct', component: MergeSellproductComponent },
      { path: 'product-barcode', component: ProductBarcodeComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'size', component: SizeComponent },
      { path: 'supplier', component: SupplierComponent },
      { path: 'unit', component: UnitComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'head', component: HeadComponent },
      { path: 'product', component: ProductComponent },
      { path: 'new-product', component: NewProductComponent },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'purchase-list', component: PurchaseListComponent },
      { path: 'product-stock-list', component: ProductStockListComponent },
      { path: 'sell', component: SellComponent },
      { path: 'sell-list', component: SellListComponent },
      { path: 'return-sell-product', component: ReturnSellProductComponent },
      { path: 'bar-code-print', component: BarCodePrintComponent },
      { path: 'customer-list', component: CustomerListComponent },
      { path: 'dailysell-list', component: DailysellListComponent },
      { path: 'supplier-payment-detail', component: SupplierPaymentDetailComponent },
      { path: 'sell-return-list', component: SellReturnListComponent },
      { path: 'supplier-payment', component: SupplierPaymentComponent },
      { path: 'supplier-payment-history', component: SupplierPaymentHistoryComponent },
      { path: 'direct-sell', component: DirectSellComponent },
      { path: 'barcode-printby-invoice', component: BarcodePrintbyInvoiceComponent },
      { path: 'transfer-product-to-sv', component: TransferProductToSVComponent },
      { path: 'transfer-sv-list', component: TransferSvListComponent },
      { path: 'direct-sell-list', component: DirectSellListComponent },
      { path: 'transfer-svdetail', component: TransferSVDetailComponent },
      { path: 'transfer-product-to-st', component: TransferProductToSTComponent },
      { path: 'stock-history', component: StockHistoryComponent },
      { path: 'direct-sell-return', component: DirectSellReturnComponent },
      { path: 'direct-sell-return-detail', component: DirectSellReturnDetailComponent },
      { path: 'sell-gst-report', component: SellGstReportComponent },
      { path: 'daily-direct-sell-report', component: DailyDirectSellReportComponent },
      { path: 'return-gst-report', component: ReturnGstReportComponent },
      { path: 'direct-sell-gst-report', component: DirectSellGstReportComponent },
      { path: 'direct-return-gst-report', component: DirectReturnGstReportComponent },
      { path: 'merge-sell-list', component: MergeSellListComponent },
      { path: 'merge-return-list', component: MergeReturnListComponent },
      { path: 'goods-return', component: GoodsReturnComponent },
      { path: 'gr-list', component: GrListComponent },
      { path: 'print-goods-return', component: PrintGoodsReturnComponent },
      { path: 'gr-data-report', component: GrDataReportComponent },
      { path: 'sell-list-by-customer', component: SellListByCustomerComponent }


    ]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
