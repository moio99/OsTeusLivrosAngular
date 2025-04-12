import { EngadirEditarData, EngadirEditarDataHora } from "../models/datas";

export class DateConvert {

  /**
    * Convierte un string a un objeto Date.
    * @param date fecha en formato yyyyMMddHHmmss.
    */
  public ConvertStringToDate(date: string): Date | null {
    if (date.length === 14) {
      var d = new Date();
      d.setUTCFullYear(+date.substring(0, 4));
      d.setUTCMonth((+date.substring(4, 6) -1));
      d.setUTCDate(+date.substring(6, 8));
      d.setUTCHours(+date.substring(8, 10));
      d.setUTCMinutes(+date.substring(10, 12));
      d.setUTCSeconds(+date.substring(12, 14));

      return d;
    }
    return null;
  }

  /**
   * Convierte un Objeto en AddEditDate. Es necesario porque al convertir un objeto mat-datepicker a data, y al llegar a la api le resta un día, por estar en UTC - 2.
   * @param value Objeto con la fecha en formato string o mat-datepicker.
   */
  public getDate(value: any): EngadirEditarData {
    let addEditDate: EngadirEditarData = { day: 0, month: 0, year: 0 };
    if (value != null && value != undefined) {
      if (!this.isString(value)) {
        let date = new Date(value);
        addEditDate = { day: date.getDate(), month: (date.getMonth() + 1), year: date.getFullYear() };
      }
      else {
        addEditDate = this.getDateFromMySQL(value);
      }
    }
    return addEditDate;
  }

  /**
   * Dolta a data no formato dd/MM/yyyy
   * @param value Objeto con la fecha en formato string o mat-datepicker.
   */
  public getDateString(value: any, separador: string) {
    let data = this.getDate(value);
    return data.day + separador + data.month + separador + data.year;
  }

  public getDateFromMySQL(value: string): EngadirEditarData {

    let addEditDate: EngadirEditarData = { day: 0, month: 0, year: 0 };
    if (value != null && value != undefined
      && value !== '' && value.length > 4) {
      if (value.indexOf('/') > -1) {
        let str = value.split('/');
        addEditDate = { day: +str[0], month: +str[1], year: +str[2] };
      }
      else if (value.indexOf('-') > -1) {
        if (value.indexOf('T') > -1) {
          let strA = value.split('-');
          let strB = strA[2].split('T');
          addEditDate = { day: +strB[0], month: +strA[1], year: +strA[0] };
        }
        else {
          let strA = value.split('-');    // 2022-12-29
          addEditDate = { day: +strA[2], month: +strA[1], year: +strA[0] };
        }
      }
    }
    return addEditDate;
  }

  /**
   * Convierte un Objeto en AddEditDateTime. Es necesario porque al convertir un objeto mat-datepicker a data, y al llegar a la api le resta un día, por estar en UTC - 2.
   * @param value Objeto con la fecha en formato string o mat-datepicker.
   * @param hour hora introducida por el usuario.
   * @param minutes minutos introducidos por el usuario
   */
  getDateTime(value: any, hour: number, minutes: number): EngadirEditarDataHora {
    let addEditDateTime: EngadirEditarDataHora = { day: 0, month: 0, year: 0, hours: 0, minutes: 0 };
    let date: Date;
    if (value !== '') {
      if (this.isString(value) && value.indexOf('-') > -1 && value.indexOf('T') > -1) {
        let strA = value.split('-');
        let secondChar = value.indexOf('T') > 0 ? 'T' : ' ';
        let strB = strA[2].split(secondChar);
        addEditDateTime = { day: +strB[0], month: +strA[1], year: +strA[0], hours: hour, minutes: minutes };
      }
      else {
        if (value != undefined) {
          date = new Date(value);
          addEditDateTime = { day: date.getDate(), month: (date.getMonth() + 1), year: date.getFullYear(), hours: hour, minutes: minutes };
        }
      }
    }
    return addEditDateTime;
  }
  /**
   * Comprueba que sea de tipo string.
   */
  isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }
}
