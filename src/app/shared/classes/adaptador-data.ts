import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class AdaptadorDaData extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    return super.parse(value);
  }

  override format(date: Date, displayFormat: Object): string {
    //if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${this._to2digit(day)}/${this._to2digit(month)}/${year}`;
    //}
    //return date.toDateString();
  }

  private _to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }
}
