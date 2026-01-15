import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LoadDataService } from './load-data.service';
import { Observable } from 'rxjs';
import { ProductStockResponse } from './interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public readonly baseUrl: string = "http://localhost:3776/";


  constructor(private http: HttpClient) {

   this.baseUrl = "http://localhost:3776/";
     //this.baseUrl = "https://darjiapi.winnexcode.com/";
  }


  getSellProductStockList(searchTerm: string): Observable<any[]> {
    const url = `${this.baseUrl}api/sellProductStock/GetProductStockList?searchTerm=${searchTerm}`;
    return this.http.get<any[]>(url);
  }

  // Fetch product details by ProductStockId
  getProductDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}api/sellProductStock/GetProductDetails/${id}`;
    return this.http.get<any>(url);
  }

  //Goods Return
  saveGRBill(obj: any) {
    return this.http.post(this.baseUrl + '/api/goodReturn/SaveGRBill', obj)
  }
  saveGoodsReturn(obj: any) {
    return this.http.post(this.baseUrl + '/api/goodReturn/SaveGoodsReturn', obj)
  }
  getGoodsReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/goodReturn/GoodsReturnList', obj)
  }
  getPrintGoodsReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/goodReturn/PrintGoodsReturnList', obj)
  }
  getGRDataReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/goodReturn/GRDataReport', obj)
  }
  getGRDataDetailReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/goodReturn/GRDataDetailReport', obj)
  }
  //GstReport 
  getSellDaybookReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/SellDaybookReport', obj)
  }
  getCompleteSellsManReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/CompleteSellsManReport', obj)
  }
  getCompleteBillerReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/CompleteBillerReport', obj)
  }

  getMergeReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/MergeReturnList', obj)
  }
  getMergeSellList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/MergeSellList', obj)
  }
  getGstDirectReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/GstDirectReturnList', obj)
  }
  getGstDirectSellList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/GstDirectSellList', obj)
  }
  getGstReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/GstReturnList', obj)
  }
  getGstSellList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/GstSellList', obj)
  }

  getSaleBillerReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/SaleBillerReport', obj)
  }
  getDirectSaleBillerReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DirectSaleBillerReport', obj)
  }
  getSaleSummaryReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/SaleSummaryReport', obj)
  }
  getDirectSaleSummaryReport(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DirectSaleSummaryReport', obj)
  }

  getHsnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/gstReport/HsnList', obj)
  }

  // TransferST_SV

  saveTransfertoSV(obj: any) {
    return this.http.post(this.baseUrl + '/api/transferToSV/SaveTransferToSV', obj)
  }

  getTransferSVList(obj: any) {
    return this.http.post(this.baseUrl + '/api/transferToSV/TransferSVList', obj)
  }

  getTransferToSVDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/transferToSV/TransferToSVDetail', obj)
  }

  getTransferToSVDetailDateWise(obj: any) {
    return this.http.post(this.baseUrl + '/api/transferTOSV/TransferToSVDetailDateWise', obj)
  }

  //Direct Sell
  saveDirectSell(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/SaveDirectSell', obj)
  }

  printDirectSellInvoice(ids: any) {
    window.open(this.baseUrl + "report/DirectSellInvoice/" + ids);
  }

  getDirectSellList(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DirectSellList', obj)
  }

  getDirectSellDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DirectSellDetail', obj)
  }

  //reports
  printBarCode(ids: any) {
    window.open(this.baseUrl + "report/index?id=" + ids);
  }

  printNewBarCode(ids: any) {
    window.open(this.baseUrl + "report/NewIndex?id=" + ids);
  }

  getPrintGRBill(ids: any) {
    window.open(this.baseUrl + "report/PrintGRBill/" + ids);
  }
  // getPrintGRBill(ids: any, FromDate: any, ToDate: any) {
  //   const url = `${this.baseUrl}report/PrintGRBill?id=${ids}&FromDate=${FromDate}&ToDate=${ToDate}`;
  //   window.open(url);
  // }


  printNewSellInvoice(ids: any) {
    window.open(this.baseUrl + "report/ExchangeSellInvoice/" + ids);
  }

  printNewDirectSellInvoice(ids: any) {
    window.open(this.baseUrl + "report/ExchangeDirectSellInvoice/" + ids);
  }

  printSellInvoice(ids: any) {
    window.open(this.baseUrl + "report/SellInvoice/" + ids);
  }

  //Enum
  getItemTypeList() {
    return this.http.get(this.baseUrl + '/api/Enum/ItemTypeList')
  }
  getPaymentStatusList() {
    return this.http.get(this.baseUrl + '/api/Enum/PaymentStatusList')
  }
  getPaymentModeList() {
    return this.http.get(this.baseUrl + '/api/Enum/PaymentModeList')
  }
  getEmployeeTypeList() {
    return this.http.get(this.baseUrl + '/api/Enum/EmployeeTypeList')
  }
  getPartyTypeList() {
    return this.http.get(this.baseUrl + '/api/Enum/PartyTypeList')
  }
  //ProductStock
  getProductBarcode(obj: any) {
    return this.http.post(this.baseUrl + '/api/report/ProductBarcode', obj)
  }

  getSupplierPaymentDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/Purchase/SupplierPaymentDetail', obj)
  }
  //ProductStock
  getOnlyProductStockList(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/OnlyProductStockList', obj)
  }
  getProductStockList(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/ProductStockList', obj)
  }
  getProductStockDetailForReturn(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/ProductStockDetailForReturn', obj)
  }
  getProductStockDetailList(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/ProductStockDetailList', obj)
  }

  
  getFilterProductStockDetailList(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/FilterProductStockDetailList', obj)
  }
  getStockDetailForSell(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/StockDetailForSell', obj)
  }
  getStockDetails(stockCode: string, pageNumber: number, pageSize: number) {
    const body = { StockCode: stockCode, PageNumber: pageNumber, PageSize: pageSize };
    return this.http.post<any>(this.baseUrl + '/api/ProductStock/StockDetailForSell', body);
  }

  getProductStockListForSearch(pageNumber: number = 1, pageSize: number = 100): Observable<ProductStockResponse> {
    const url = `${this.baseUrl}/api/ProductStock/GetProductStockList?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<ProductStockResponse>(url);
  }
  

  getProductStockDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/ProductStockDetail', obj)
  }

  getProductStockHistoryList(obj: any) {
    return this.http.post(this.baseUrl + '/api/ProductStock/ProductStockHistoryList', obj)
  }
  //Supplier Payment

  saveSupplierPayment(obj: any) {
    return this.http.post(this.baseUrl + '/api/supplierPayment/SaveSupplierPayment', obj)
  }

  getPartyPaymentList(obj: any) {
    return this.http.post(this.baseUrl + '/api/supplierPayment/PartyPaymentList', obj)
  }

  getSupplierPaymentHistory(obj: any) {
    return this.http.post(this.baseUrl + '/api/supplierPayment/SupplierPaymentHistory', obj)
  }

  getSupplierPaymentList(obj: any) {
    return this.http.post(this.baseUrl + '/api/supplierPayment/SupplierPaymentList', obj)
  }

  //Sell
  saveReturnProduct(data: any) {
    return this.http.post(this.baseUrl + '/api/returnProduct/SaveReturnProduct', data)
  }
  SaveReturnDirectSell(data: any) {
    return this.http.post(this.baseUrl + '/api/returnDirSell/SaveReturnDirectSell', data)
  }
  saveNewSellItem(obj: any) {
    return this.http.post(this.baseUrl + '/api/returnProduct/SaveNewSellItem', obj)
  }
  saveNewDirectSellItem(obj: any) {
    return this.http.post(this.baseUrl + '/api/returnDirSell/SaveNewDirectSellItem', obj)
  }
  getBillDetailList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/BillDetail', obj)
  }
  getDirectBillDetailForReturn(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DirectBillDetailForReturn', obj)
  }
  getDirectBillDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DirectBillDetail', obj)
  }
  getDailySellList(SellDateModel: any) {
    return this.http.post(this.baseUrl + '/api/Sell/DailySellList', SellDateModel)
  }
  getDailyDirectSellList(SellDateModel: any) {
    return this.http.post(this.baseUrl + '/api/directSell/DailyDirectSellList', SellDateModel)
  }

  getSellReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/returnProduct/SellReturnList', obj)
  }
  getDirectSellReturnList(obj: any) {
    return this.http.post(this.baseUrl + '/api/returnDirSell/DirectSellReturnList', obj)
  }
  getSellList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/SellList', obj)
  }
  getSellDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/SellDetail', obj)
  }
  saveSell(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/saveSell', obj)
  }
  deleteSell(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/deleteSell', obj)
  }

  //Purchase
  getShopList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Purchase/ShopList', obj)
  }
  getPurchaseList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Purchase/PurchaseList', obj)
  }
  getPurchaseDetail(obj: any) {
    return this.http.post(this.baseUrl + '/api/Purchase/PurchaseDetail', obj)
  }
  savePurchase(obj: any) {
    return this.http.post(this.baseUrl + '/api/Purchase/savePurchase', obj)
  }
  deletePurchase(obj: any) {
    return this.http.post(this.baseUrl + '/api/Purchase/deletePurchase', obj)
  }

  //Category
  getCategoryList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Category/CategoryList', obj)
  }
  saveCategory(obj: any) {
    return this.http.post(this.baseUrl + '/api/Category/saveCategory', obj)
  }
  deleteCategory(obj: any) {
    return this.http.post(this.baseUrl + '/api/Category/deleteCategory', obj)
  }

  //Customer
  getCustomerList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Customer/CustomerList', obj)
  }
  getSellListByCustomer(obj: any) {
    return this.http.post(this.baseUrl + '/api/Sell/SellListByCustomer', obj)
  }
  saveCustomerList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Customer/saveCustomer', obj)
  }
  deleteCustomer(obj: any) {
    return this.http.post(this.baseUrl + '/api/Customer/deleteCustomer', obj)
  }

  //GST
  getGSTList(obj: any) {
    return this.http.post(this.baseUrl + '/api/GST/GSTList', obj)
  }
  saveGST(obj: any) {
    return this.http.post(this.baseUrl + '/api/GST/saveGST', obj)
  }
  deleteGST(obj: any) {
    return this.http.post(this.baseUrl + '/api/GST/deleteGST', obj)
  }
  //Product
  getProductList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Product/ProductList', obj)
  }
  saveProduct(obj: any) {
    return this.http.post(this.baseUrl + '/api/Product/saveProduct', obj)
  }
  deleteProduct(obj: any) {
    return this.http.post(this.baseUrl + '/api/Product/deleteProduct', obj)
  }

  //Unit
  getUnitList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Unit/UnitList', obj)
  }
  saveUnit(obj: any) {
    return this.http.post(this.baseUrl + '/api/Unit/saveUnit', obj)
  }
  deleteUnit(obj: any) {
    return this.http.post(this.baseUrl + '/api/Unit/deleteUnit', obj)
  }

  //Employee
  getEmployeeList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Employee/EmployeeList', obj)
  }
  saveEmployee(obj: any) {
    return this.http.post(this.baseUrl + '/api/Employee/saveEmployee', obj)
  }
  deleteEmployee(obj: any) {
    return this.http.post(this.baseUrl + '/api/Employee/deleteEmployee', obj)
  }
  changePassword(obj: any) {
    return this.http.post(this.baseUrl + '/api/Employee/changePassword', obj)
  }
  employeeLogin(obj: any) {
    return this.http.post(this.baseUrl + '/api/Employee/EmployeeLogin', obj)
  }

  //Size
  getSizeList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Size/SizeList', obj)
  }
  saveSize(obj: any) {
    return this.http.post(this.baseUrl + '/api/Size/saveSize', obj)
  }
  deleteSize(obj: any) {
    return this.http.post(this.baseUrl + '/api/Size/deleteSize', obj)
  }

  //Head
  getHeadList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Head/HeadList', obj)
  }
  saveHead(obj: any) {
    return this.http.post(this.baseUrl + '/api/Head/saveHead', obj)
  }
  deleteHead(obj: any) {
    return this.http.post(this.baseUrl + '/api/Head/deleteHead', obj)
  }

  //Supplier
  getAllSupplierList(obj: any) {
    return this.http.post(this.baseUrl + '/api/supplierPayment/SupplierList', obj)
  }
  getSupplierList(obj: any) {
    return this.http.post(this.baseUrl + '/api/Supplier/SupplierList', obj)
  }
  saveSupplier(obj: any) {
    return this.http.post(this.baseUrl + '/api/Supplier/saveSupplier', obj)
  }
  deleteSupplier(obj: any) {
    return this.http.post(this.baseUrl + '/api/Supplier/deleteSupplier', obj)
  }

  printBarCodeFinal(ids: any) {
    window.open(`${this.baseUrl}report/index1?id=${ids}`);
  }
  printBarCodeNewFinal(ids: any) {
    window.open(`${this.baseUrl}report/index2?id=${ids}`);
  }
  printBarCode1(data: any) {
    window.open(`${this.baseUrl}report/index1/${data}`);
  }
}
