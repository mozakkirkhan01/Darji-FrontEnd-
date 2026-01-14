import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { LocalService } from "../../utils/local.service";

@Component({
  selector: 'app-admin-master',
  templateUrl: './admin-master.component.html'
})
export class AdminMasterComponent implements OnInit {
  IsMenuShow = true;
  dataLoading: boolean = false;
  employeeDetail: any = {};

  constructor(
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
  }

  hideSideBar() {
    if (this.IsMenuShow) {
      $('body').addClass('toggle-sidebar');
      this.IsMenuShow = false;
    }
    else {
      $('body').removeClass('toggle-sidebar');
      this.IsMenuShow = true;
    }

  }

  logOut() {
    this.localService.removeEmployeeDetail();
    this.router.navigate(['/admin-login']);
  }

}
