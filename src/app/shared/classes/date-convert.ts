import { EngadirEditarData } from "../models/datas";

export class ConverterAData {

  /**
   * Obtén unha estrutura EngadirEditarData compatible a partir de calquera formato de data
   * @param value Objeto coa data en formato string ou mat-datepicker.
   */
  public getData(value: string | Date | number | null | undefined): EngadirEditarData {
    // Se o valor é nulo, indefinido ou unha cadea baleira, paramos de xeito seguro
    if (value === null || value === undefined || value === '') {
      return { day: 0, month: 0, year: 0 };
    }

    // Se é un string, delegamos directamente no método optimizado de MySQL
    if (typeof value === 'string') {
      return this.getDataFromMySQL(value);
    }
    const dataNativa = new Date(value);

    if (!isNaN(dataNativa.getTime())) {
      return {
        day: dataNativa.getDate(),
        month: dataNativa.getMonth() + 1, // En JS os meses van de 0 a 11
        year: dataNativa.getFullYear()
      };
    }

    // Por se chega un formato non recoñecido ou corrupto
    return { day: 0, month: 0, year: 0 };
  }

  /**
   * Converte calquera formato de data nunha cadea de texto formateada co separador escollido
   * @param value Obxeto coa data en formato string ou mat-datepicker.
   */
  public getDataString(
    value: string | Date | number | null | undefined,
    separador: string
  ): string {
    // Obtemos a estrutura limpa de EngadirEditarData
    const data = this.getData(value);

    if (data.day === 0 && data.month === 0 && data.year === 0) {
      return '';
    }

    return `${data.day}${separador}${data.month}${separador}${data.year}`;
  }


  public getDataFromMySQL(value: string | null | undefined): EngadirEditarData {
    // Protección inicial con encadeamento opcional e recorte de espazos
    if (!value?.trim() || value.length < 4) {
      return { day: 0, month: 0, year: 0 };
    }

    // CASO 1: Formato clásico "DD/MM/YYYY" (Se vén con barras)
    if (value.includes('/')) {
      const [day, month, year] = value.split('/').map(Number);
      return { day, month, year };
    }

    // CASO 2: Formato MySQL/ISO "YYYY-MM-DD" (con ou sen "T" de hora)
    // O constructor 'new Date()' de JavaScript le nativamente os formatos baseados en guións
    const dataNativa = new Date(value);

    // Verificamos que a data sexa válida antes de extraer os compoñentes
    if (!isNaN(dataNativa.getTime())) {
      return {
        day: dataNativa.getDate(),
        month: dataNativa.getMonth() + 1, // Lembra que en JS os meses van de 0 a 11
        year: dataNativa.getFullYear()
      };
    }

    // Se chega un formato totalmente descoñecido, devolvemos a estrutura a cero
    return { day: 0, month: 0, year: 0 };
  }

  /**
   * Comprueba que sexa de tipo string.
   */
  isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }
}
