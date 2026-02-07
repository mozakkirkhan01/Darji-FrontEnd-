import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocalService } from "../../utils/local.service";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-admin-master',
  templateUrl: './admin-master.component.html'
})
export class AdminMasterComponent implements OnInit, OnDestroy {

  IsMenuShow = true;
  dataLoading = false;
  employeeDetail: any = {};
  isDarziUser = false;

  /* ================= SECURITY CONFIG ================= */
  private readonly MENU_PASSWORD = '1786';
  private readonly AUTH_MENUS_KEY = 'auth_menus';
  private readonly AUTH_TIMESTAMP_KEY = 'auth_timestamp';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min

  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_TIME = 5 * 60 * 1000; // 5 min

  private loginAttempts: { [key: string]: number } = {};
  private lockedMenus: { [key: string]: number } = {};

  /* ================= MODAL STATE ================= */
  showPasswordModal = false;
  enteredPassword = '';
  currentMenuKey = '';
  currentRoute = '';

  private routerSubscription?: Subscription;

  constructor(
    private localService: LocalService,
    private router: Router
  ) {}

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.employeeDetail = this.localService.getEmployeeDetail();
    this.validateSession();

    // Darzi → Sell only
    if (this.employeeDetail?.UserName?.toLowerCase() === 'darzi') {
      this.isDarziUser = true;
      this.router.navigate(['/admin/sell']);
    }

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.validateSession());
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  /* ================= UI ================= */
  hideSideBar() {
    this.IsMenuShow = !this.IsMenuShow;
    $('body').toggleClass('toggle-sidebar');
  }

  /* ================= SESSION ================= */
  private validateSession(): void {
    const timestamp = sessionStorage.getItem(this.AUTH_TIMESTAMP_KEY);
    if (!timestamp) return;

    const last = Number(timestamp);
    if (Date.now() - last > this.SESSION_TIMEOUT) {
      this.clearAllAuthorizations();
      alert('⏱️ Session expired. Please unlock menus again.');
    } else {
      this.updateSessionTimestamp();
    }
  }

  private updateSessionTimestamp(): void {
    sessionStorage.setItem(this.AUTH_TIMESTAMP_KEY, Date.now().toString());
  }

  /* ================= AUTH STORAGE ================= */
  private getAuthorizedMenus(): { [key: string]: boolean } {
    try {
      return JSON.parse(sessionStorage.getItem(this.AUTH_MENUS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  private saveAuthorizedMenus(menus: { [key: string]: boolean }): void {
    sessionStorage.setItem(this.AUTH_MENUS_KEY, JSON.stringify(menus));
    this.updateSessionTimestamp();
  }

  private isMenuAuthorized(menuKey: string): boolean {
    return this.getAuthorizedMenus()[menuKey] === true;
  }

  private authorizeMenu(menuKey: string): void {
    const menus = this.getAuthorizedMenus();
    menus[menuKey] = true;
    this.saveAuthorizedMenus(menus);
    this.loginAttempts[menuKey] = 0;
  }

  /* ================= LOCKOUT ================= */
  private isMenuLocked(menuKey: string): boolean {
    const lockedAt = this.lockedMenus[menuKey];
    if (!lockedAt) return false;

    if (Date.now() - lockedAt > this.LOCKOUT_TIME) {
      delete this.lockedMenus[menuKey];
      this.loginAttempts[menuKey] = 0;
      return false;
    }
    return true;
  }

  private recordFailedAttempt(menuKey: string): void {
    this.loginAttempts[menuKey] = (this.loginAttempts[menuKey] || 0) + 1;

    if (this.loginAttempts[menuKey] >= this.MAX_ATTEMPTS) {
      this.lockedMenus[menuKey] = Date.now();
      alert('🔒 Menu locked for 5 minutes due to multiple failures.');
    }
  }

  /* ================= PASSWORD CHECK ================= */
  checkMenuAccess(menuKey: string, route: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.validateSession();

    if (this.isMenuAuthorized(menuKey)) {
      this.router.navigate([route]);
      return;
    }

    if (this.isMenuLocked(menuKey)) {
      alert('🔒 This menu is temporarily locked.');
      return;
    }

    this.currentMenuKey = menuKey;
    this.currentRoute = route;
    this.enteredPassword = '';
    this.showPasswordModal = true;
  }

  /* ================= MODAL SUBMIT ================= */
  submitPassword(): void {
    if (this.enteredPassword.trim() === this.MENU_PASSWORD) {
      this.authorizeMenu(this.currentMenuKey);
      this.showPasswordModal = false;
      this.router.navigate([this.currentRoute]);
    } else {
      this.recordFailedAttempt(this.currentMenuKey);
      this.enteredPassword = '';
      alert('❌ Wrong password');
    }
  }

  cancelPassword(): void {
    this.showPasswordModal = false;
    this.enteredPassword = '';
  }

  /* ================= LOCKING ================= */
  lockAllMenus(): void {
    this.clearAllAuthorizations();
    alert('🔒 All menus locked');
  }

  private clearAllAuthorizations(): void {
    sessionStorage.removeItem(this.AUTH_MENUS_KEY);
    sessionStorage.removeItem(this.AUTH_TIMESTAMP_KEY);
    this.loginAttempts = {};
    this.lockedMenus = {};
  }

  /* ================= LOGOUT ================= */
  logOut(): void {
    this.localService.removeEmployeeDetail();
    this.clearAllAuthorizations();
    this.router.navigate(['/admin-login']);
  }
}
