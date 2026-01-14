import { Injectable,ViewChild, ElementRef} from '@angular/core';
import * as XLSX from "xlsx";

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {

  constructor() { }

  exportToExcel(table_1: ElementRef, excelName: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      table_1.nativeElement
    );

    // /* new format */
    // var fmt = "0.00";
    // /* change cell format of range B2:D4 */
    // var range = { s: { r: 1, c: 1 }, e: { r: 2, c: 100000 } };
    // for (var R = range.s.r; R <= range.e.r; ++R) {
    //   for (var C = range.s.c; C <= range.e.c; ++C) {
    //     var cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
    //     if (!cell || cell.t != "n") continue; // only format numeric cells
    //     cell.z = fmt;
    //   }
    // }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    var fmt = "@";
    wb.Sheets["Sheet1"]["F"] = fmt;

    /* save to file */
    XLSX.writeFile(wb, excelName + ".xlsx");
  }


  round(value: number, NoOfDecimals?: number) {
    var multiflyFactor: number = 1;
    if (NoOfDecimals != null) {
      for (let i = 0; i < NoOfDecimals; i++) {
        multiflyFactor *=10;
      }
      value = value * multiflyFactor;
    } 
    if (value - Math.floor(value) >= 0.5) {
      return Math.ceil(value) / multiflyFactor;
    } else {
      return Math.floor(value) / multiflyFactor;
    }
  }

  // replaceSpecialCharacter(value: string): string {
  //   value = value.replace(/\+/g, "sadsahgd5");
  //   value = value.replace(/\//g, "dssjkhhjskald5");
  //   value = value.replace(/\&/g, "43232423");
  //   return value;
  // }

  replaceSpecialCharacter(value: string): string {
    return value.replace(/\+/g, "sadsahgd5")
                .replace(/\//g, "dssjkhhjskald5")
                .replace(/\&/g, "43232423");
  }
  
  
  

  loadDateMDY(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2),
      d.getFullYear(),
    ].join('-');
    return dformat;
  }

  loadDateMDYT(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2),
      d.getFullYear(),
    ].join('-')
    + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }


  loadDateDMY(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      ("0" + d.getDate()).slice(-2),
      ("0" + (d.getMonth() + 1)).slice(-2),
      d.getFullYear(),
    ].join('-');
    return dformat;
  }

  loadDateDMYT(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      ("0" + d.getDate()).slice(-2),
      ("0" + (d.getMonth() + 1)).slice(-2),
      d.getFullYear(),
    ].join('-')
    + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }

  loadDateYMD(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      d.getFullYear(),
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2)
    ].join('-');
    return dformat;
  }

  loadDateYMDT(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      d.getFullYear(),
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2)
    ].join('-')
    + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }

  loadDateYDM(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      d.getFullYear(),
      ("0" + d.getDate()).slice(-2),
      ("0" + (d.getMonth() + 1)).slice(-2),
    ].join('-')
    ;
    return dformat;
  }

  loadDateTime(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      d.getFullYear(),
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2)
    ].join('-')
      + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }
  addDays(oldDate: any, days: number) {
    var date = new Date(oldDate);
    date.setDate(date.getDate() + days);
    return date;
  }
}
