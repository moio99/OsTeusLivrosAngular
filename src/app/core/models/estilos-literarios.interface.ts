export interface EstiloLiterarioData {
  estiloLiterario: EstiloLiterario[];
  meta: {id:number, quantidade:number};
}

export interface EstiloLiterario {
  id: number;
  nome: string;
  comentario?: string | null;
}
