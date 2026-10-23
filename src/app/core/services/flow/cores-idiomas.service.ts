import { Service } from '@angular/core';
import { CORES_IDIOMAS, CoresIdioma } from '../../../shared/cores.idiomas.config';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class CoresIdiomasService {
  constructor() { }

  private coresIdiomas: { [key: number]: CoresIdioma } = {};

  getCoreIdioma(idIdioma: number): string {
    const coresIdioma = this.coresIdiomas[idIdioma];
    if (!coresIdioma) {
      throw new Error(`Nom existe em CoresIdioma para idIdioma=${idIdioma}`);
    }
    return coresIdioma.cor;
  }

  // Función principal
  obterOuXerarCor(idIdioma: number): string {

    // Copia local das cores para poder engadir as novas que se xeren dinamicamente
    this.coresIdiomas = { ...CORES_IDIOMAS };

    // Se o idioma xa existe (no listado orixinal ou xerado), devolvemos a súa cor
    if (this.coresIdiomas[idIdioma]) {
        return this.coresIdiomas[idIdioma].cor;
    }

    // Se non existe, imos extraer todas as cores que xa están en uso
    const coresExistentes = Object.values(this.coresIdiomas).map(c => c.cor);

    let novaCorHex = '';
    let corValida = false;
    let intentos = 0;

    // Bucle para buscar unha cor diferente (máximo 50 intentos para evitar bucles infinitos)
    while (!corValida && intentos < 50) {
        // Xeramos un matiz aleatorio entre 0 e 360 graos
        const matiz = Math.floor(Math.random() * 360);
        // Fixamos saturación (70%) e luminosidade (50%) para que sexan cores vivas e lexibles
        const corPropostaHex = this.hslToHex(matiz, 70, 50);

        // Comprobamos se a cor proposta é moi parecida ás que xa existen
        const eMoiParecida = coresExistentes.some(corHex =>
            this.calcularDiferenzaCores(corHex, corPropostaHex) < 40 // Limiar de diferenza
        );

        if (!eMoiParecida) {
            novaCorHex = corPropostaHex;
            corValida = true;
        }
        intentos++;
    }

    // Se tras 50 intentos non atopa unha óptima (raro), asigna a última xerada
    if (!novaCorHex) novaCorHex = this.hslToHex(Math.floor(Math.random() * 360), 70, 50);

    // Gardamos a nova cor no noso listado para que non se volva a xerar para este idioma
    this.coresIdiomas[idIdioma] = {
        nome: `Idioma descoñecido (${idIdioma})`,
        cor: novaCorHex
    };

    return novaCorHex;
  }

  // --- FUNCIÓNS AUXILIARES DE CONVERSIÓN E CÁLCULO ---

  // Converte HSL a HEX (Necesario para xerar cores visualmente controladas)
  private hslToHex(h: number, s: number, l: number): string {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Converte HEX a RGB e calcula a distancia euclidiana entre as dúas cores
  private calcularDiferenzaCores(hex1: string, hex2: string): number {
      const r1 = parseInt(hex1.substring(1, 3), 16);
      const g1 = parseInt(hex1.substring(3, 5), 16);
      const b1 = parseInt(hex1.substring(5, 7), 16);

      const r2 = parseInt(hex2.substring(1, 3), 16);
      const g2 = parseInt(hex2.substring(3, 5), 16);
      const b2 = parseInt(hex2.substring(5, 7), 16);

      // Fórmula de distancia 3D básica
      return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
  }
}
