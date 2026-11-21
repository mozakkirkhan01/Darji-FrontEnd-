import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

declare var toastr: any;
declare var $: any;

import { AppService } from '../../utils/app.service';
import { ConstantData } from '../../utils/constant-data';
import { LoadDataService } from '../../utils/load-data.service';
import { LocalService } from '../../utils/local.service';

@Component({
  selector: 'app-customer-tier-report',
  templateUrl: './customer-tier-report.component.html',
  styleUrls: ['./customer-tier-report.component.css']
})
export class CustomerTierReportComponent implements OnInit {
  employeeDetail: any;
  dataLoading: boolean = false;
  CustomerTierList: any[] = [];
  Summary: any = {
    TotalCustomers: 0,
    SilverCount: 0,
    SilverRevenue: 0,
    PlatinumCount: 0,
    PlatinumRevenue: 0,
    GoldCount: 0,
    GoldRevenue: 0,
    NoPurchaseCount: 0,
    TotalRevenue: 0
  };

  filter: any = {
    Tier: 'All',
    FromDate: null,
    ToDate: null
  };

  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'NetPurchased';
  p: number = 1;
  pageSize = ConstantData.PageSizes;
  itemPerPage: number = this.pageSize[0];

  @ViewChild('table1') table: ElementRef;
  isExporting: boolean = false;

  constructor(
    private service: AppService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.getCustomerTierReport();
  }

  getCustomerTierReport() {
    this.dataLoading = true;
    const obj = {
      ShopId: this.employeeDetail ? this.employeeDetail.ShopId : null,
      FromDate: this.filter.FromDate ? this.loadDataService.loadDateYMD(this.filter.FromDate) : null,
      ToDate: this.filter.ToDate ? this.loadDataService.loadDateYMD(this.filter.ToDate) : null,
      Tier: this.filter.Tier,
      SearchTerm: ''
    };

    this.service.getCustomerTierReport(obj).subscribe(
      (response: any) => {
        this.dataLoading = false;
        if (response && response.Message === ConstantData.SuccessMessage) {
          this.CustomerTierList = response.CustomerTierList || [];
          this.Summary = response.Summary || this.Summary;
        } else {
          this.CustomerTierList = [];
          toastr.error(response?.Message || 'Failed to load customer tier report.');
        }
      },
      (error: any) => {
        this.dataLoading = false;
        toastr.error('Error occurred while fetching data.');
      }
    );
  }

  selectTier(tier: string) {
    this.filter.Tier = tier;
    this.p = 1;
    this.getCustomerTierReport();
  }

  resetFilter() {
    this.filter = {
      Tier: 'All',
      FromDate: null,
      ToDate: null
    };
    this.Search = '';
    this.p = 1;
    this.getCustomerTierReport();
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p;
  }

  exportToExcel() {
    if (!this.CustomerTierList || this.CustomerTierList.length === 0) {
      toastr.warning('No data available to export.');
      return;
    }
    this.isExporting = true;
    const originalItemPerPage = this.itemPerPage;
    const originalPage = this.p;
    this.p = 1;
    this.itemPerPage = this.CustomerTierList.length;

    setTimeout(() => {
      this.loadDataService.exportToExcel(
        this.table,
        'Customer Tier Report ' + this.loadDataService.loadDateTime(new Date())
      );
      this.itemPerPage = originalItemPerPage;
      this.p = originalPage;
      this.isExporting = false;
    }, 1000);
  }

  viewCustomer(customerId: number) {
    this.router.navigate(['/admin/sell-list-by-customer'], { queryParams: { customerId: customerId } });
  }
}
