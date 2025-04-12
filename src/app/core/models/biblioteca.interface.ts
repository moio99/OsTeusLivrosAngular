export interface BibliotecaData {
  biblioteca: Biblioteca[];
  meta: {id:number, quantidade:number};
}

export interface Biblioteca {
  id: number;
  nome: string;
  endereco: string | null,
  localidade: string | null,
  telefone: string | null,
  dataAsociamento: string;
  dataRenovacom: string;
  comentario: string | null,
}
