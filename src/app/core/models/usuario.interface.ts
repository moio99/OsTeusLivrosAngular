export interface DadosLogueo {
  token: string;
  usuario: UsuarioLogado;
}

export interface UsuarioLogado {
  nome: string;
  id: number;
  idioma: number;
}

export interface Usuario {
  nome: string;
  contrasinal: string;
}
