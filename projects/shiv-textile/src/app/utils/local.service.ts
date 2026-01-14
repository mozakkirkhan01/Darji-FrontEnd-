import { Injectable } from '@angular/core';
import *  as CryptoJS from 'crypto-js';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  //key = "45jsdsb444";

  key = CryptoJS.enc.Utf8.parse('7485412547845874'); //16 word
  iv = CryptoJS.enc.Utf8.parse('7485412547845874');

  constructor(private route: Router) { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    return this.decrypt(data);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  // public encrypt(txt: string): string {
  //   return CryptoJS.AES.encrypt(txt, this.key).toString();
  // }

  // public decrypt(txtToDecrypt: string) {
  //   return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  // }

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txt), this.key,
    {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  public decrypt(txtToDecrypt: string):string {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  //Employee
  public employeeDetail = "455115dfsdfs";
  setEmployeeDetail(obj: any) {
    this.saveData(this.employeeDetail, JSON.stringify(obj));
  }

  getEmployeeDetail() {
    var obj = this.getData(this.employeeDetail);
    if (obj == null || obj == "" || obj == undefined)
      this.route.navigate(['/employee-login']);
    return JSON.parse(obj);
  }

  removeEmployeeDetail(){
    this.removeData(this.employeeDetail);
  }

}
