import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var toastr: any;
declare var $: any;

import { AppService } from "../../utils/app.service";
import { ConstantData } from "../../utils/constant-data";
import { LocalService } from "../../utils/local.service";
import { LoadDataService } from '../../utils/load-data.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-sell-list-by-customer',
  templateUrl: './sell-list-by-customer.component.html',
  styleUrls: ['./sell-list-by-customer.component.css']
})
export class SellListByCustomerComponent implements OnInit {
  employeeDetail: any;
  sell: any = {};
  SellList: any[] = [];
  dataLoading: boolean = false;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'InvoiceDate';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];
  
  submitted: boolean = false;
  CustomerList: any[] = [];
  AllCustomerList: any[] = [];
  SelectedCustomer: any = {};
  SellTotal: any = {};

  // Search related properties
  private searchSubject = new Subject<string>();
  loadingCustomers: boolean = false;
  customerSearchTerm: string = '';
  Math = Math; // Fix: Properly assign Math object

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.sell.ShopId = this.employeeDetail.ShopId;
    
    this.initializeSellTotal();
    this.setupSearchListener();
    this.getCustomerList();
  }

  initializeSellTotal() {
    this.SellTotal = {
      DiscountAmount: 0,
      TotalProductAmount: 0,
      TotalCharges: 0,
      TaxableAmount: 0,
      CGSTAmount: 0,
      SGSTAmount: 0,
      IGSTAmount: 0,
      NetAmount: 0,
      RoundOff: 0,
      GrandTotal: 0,
      DuesAmount: 0
    };
  }

  // Setup search listener with debouncing
  setupSearchListener() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm: string) => {
      this.performCustomerFilter(searchTerm);
    });
  }

  // Filter customers based on search term
  filterCustomerList(value: string) {
    this.customerSearchTerm = value || '';
    
    // Clear selected customer if search term doesn't match
    if (this.SelectedCustomer.DisplayText && 
        !this.SelectedCustomer.DisplayText.toLowerCase().includes(value?.toLowerCase() || '')) {
      this.SelectedCustomer = {};
      this.sell.CustomerId = null;
    }
    
    this.searchSubject.next(value || '');
  }

  performCustomerFilter(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.CustomerList = [...this.AllCustomerList];
      return;
    }

    const filterValue = searchTerm.toLowerCase().trim();
    this.CustomerList = this.AllCustomerList.filter(customer => 
      customer.CustomerName.toLowerCase().includes(filterValue) ||
      customer.MobileNo.includes(filterValue) ||
      (customer.GSTNo && customer.GSTNo.toLowerCase().includes(filterValue))
    );
  }

  // Get customer list from backend
  getCustomerList() {
    this.loadingCustomers = true;
    const obj = {
      ShopId: this.sell.ShopId
    };

    this.service.getCustomerList(obj).subscribe(
      (response: any) => {
        this.loadingCustomers = false;
        if (response && response.Message === ConstantData.SuccessMessage) {
          this.AllCustomerList = response.CustomerList.map((customer: any) => ({
            ...customer,
            DisplayText: `${customer.CustomerName} - ${customer.MobileNo}${customer.GSTNo ? ' - ' + customer.GSTNo : ''}`
          }));
          this.CustomerList = [...this.AllCustomerList];
          console.log('Customers loaded:', this.CustomerList.length); // Debug log
        } else {
          console.error('Customer API Response:', response);
          toastr.error(response?.Message || 'Error loading customers');
          this.AllCustomerList = [];
          this.CustomerList = [];
        }
      },
      (error) => {
        console.error('Customer API Error:', error);
        toastr.error('Error occurred while fetching customer data.');
        this.loadingCustomers = false;
        this.AllCustomerList = [];
        this.CustomerList = [];
      }
    );
  }

  // When customer is selected from autocomplete
  onCustomerSelected(event: any) {
    try {
      const selectedCustomer = this.AllCustomerList.find(customer => 
        customer.CustomerId == event.option.value
      );
      
      if (selectedCustomer) {
        this.SelectedCustomer = selectedCustomer;
        this.sell.CustomerId = selectedCustomer.CustomerId;
        this.customerSearchTerm = selectedCustomer.DisplayText;
        console.log('Customer selected:', this.SelectedCustomer); // Debug log
      }
    } catch (error) {
      console.error('Error during customer selection:', error);
      toastr.error('Error occurred while selecting customer.');
    }
  }

  // Clear selected customer
  clearCustomer() {
    this.SelectedCustomer = {};
    this.sell.CustomerId = null;
    this.customerSearchTerm = '';
    this.CustomerList = [...this.AllCustomerList];
    this.SellList = []; // Clear sell list when customer is cleared
  }

  // Search sell list based on selected customer
  searchSellList() {
    if (!this.sell.CustomerId) {
      toastr.warning('Please select a customer first.');
      return;
    }
    this.getSellList();
  }

  // Get sell list from backend
  getSellList() {
    // Reset totals
    this.initializeSellTotal();

    const obj = {
      FromDate: this.sell.FromDate ? this.loadDataService.loadDateYMD(this.sell.FromDate) : null,
      ToDate: this.sell.ToDate ? this.loadDataService.loadDateYMD(this.sell.ToDate) : null,
      ShopId: this.sell.ShopId,
      CustomerId: this.sell.CustomerId || null
    };

    console.log('Search parameters:', obj); // Debug log

    this.dataLoading = true;
    this.service.getSellListByCustomer(obj).subscribe(
      (response: any) => {
        this.dataLoading = false;
        console.log('Sell API Response:', response); // Debug log
        
        if (response && response.Message === ConstantData.SuccessMessage) {
          this.SellList = response.SellList || [];
          this.calculateSellTotal();
          console.log('Sell list loaded:', this.SellList.length); // Debug log
        } else {
          console.error('Sell API Error:', response);
          toastr.error(response?.Message || 'Error loading sell data');
          this.SellList = [];
        }
      },
      (error) => {
        console.error('Sell API Error:', error);
        toastr.error("Error occurred while fetching sell data.");
        this.dataLoading = false;
        this.SellList = [];
      }
    );
  }

  // Calculate total amounts
  calculateSellTotal() {
    this.initializeSellTotal(); // Reset totals first
    
    this.SellList.forEach((sell: any) => {
      this.SellTotal.TotalCharges += sell.TotalCharges || 0;
      this.SellTotal.TaxableAmount += sell.TaxableAmount || 0;
      this.SellTotal.CGSTAmount += sell.CGSTAmount || 0;
      this.SellTotal.SGSTAmount += sell.SGSTAmount || 0;
      this.SellTotal.IGSTAmount += sell.IGSTAmount || 0;
      this.SellTotal.NetAmount += sell.NetAmount || 0;
      this.SellTotal.RoundOff += sell.RoundOff || 0;
      this.SellTotal.GrandTotal += sell.GrandTotal || 0;
      this.SellTotal.DuesAmount += sell.DuesAmount || 0;
    });

    // Round the totals
    Object.keys(this.SellTotal).forEach(key => {
      this.SellTotal[key] = this.loadDataService.round(this.SellTotal[key], 2);
    });
  }

  // Pagination
  onTableDataChange(p: any) {
    this.p = p;
  }

  // Sorting
  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  // Edit sell record
  editSell(sell: any) {
    this.router.navigate(['/admin/sell'], { 
      queryParams: { 
        id: sell.SellId, 
        redUrl: '/admin/sell-list-by-customer' 
      } 
    });
  }

  // Print invoice
  printInvoice(sell: any) {
    if (sell.OldSellId == sell.SellId) {
      this.service.printSellInvoice(sell.OldSellId);
    } else if (sell.NewSellId == sell.SellId) {
      this.service.printNewSellInvoice(sell.SellId);
    } else {
      this.service.printSellInvoice(sell.SellId);
    }
  }

  // Get sell detail for modal
  Sell: any = {};
  SellChargeList: any[] = [];
  SellProductList: any[] = [];

  getSellDetail(sellModel: any) {
    this.dataLoading = true;
    this.service.getSellDetail(sellModel).subscribe(
      (response: any) => {
        this.dataLoading = false;
        if (response && response.Message === ConstantData.SuccessMessage) {
          this.Sell = response.Sell;
          this.SellChargeList = response.SellChargeList;
          this.SellProductList = response.SellProductList;
          $('#modal_popUp').modal('show');
        } else {
          toastr.error(response?.Message || 'Error loading sell details');
        }
      },
      (error) => {
        console.error('Sell Detail Error:', error);
        toastr.error("Error occurred while fetching sell details.");
        this.dataLoading = false;
      }
    );
  }

  // Delete sell record
  deleteSell(sell: any) {
    if (confirm("Are you sure you want to delete this record?") == true) {
      this.dataLoading = true;
      this.service.deleteSell(sell).subscribe(
        (response: any) => {
          this.dataLoading = false;
          if (response && response.Message === ConstantData.SuccessMessage) {
            toastr.success("Record deleted successfully.");
            this.getSellList();
          } else {
            toastr.error(response?.Message || 'Error deleting record');
          }
        },
        (error) => {
          console.error('Delete Error:', error);
          toastr.error("Error occurred while deleting record.");
          this.dataLoading = false;
        }
      );
    }
  }
}