import { Injectable } from '@angular/core';
import { environment, environments } from '../../../../environments/environment';
import { DadosLogueo, UsuarioLogado } from '../../models/usuario.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usuarioLogado: UsuarioLogado | undefined;
  private _usuarioToken: string | undefined;

  constructor(private http: HttpClient) {
  }

  // Método para simular el cierre de sesión
  logout() {
    this._usuarioLogado = undefined;
    this._usuarioToken = undefined;
  }

  setUserData(usaurio: DadosLogueo) {
    this._usuarioLogado = usaurio.usuario;
    this._usuarioToken = usaurio.token;
  }

  getToken(): string | undefined {
    return this._usuarioToken;
  }

  getUsuarioLogado(): UsuarioLogado | undefined {
    return this._usuarioLogado;
  }

  // Método para verificar si el usuario está autenticado
  estaAutenticado(rota: string): boolean {
    /* if (rota.includes('livros')) {              // página nom permitida
      return false;
    } */

    // environments.pre é a versom para railway (na nuve)
    if (environment.whereIAm !== environments.pre && environment.whereIAm !== environments.pro) {
      return true;
    }
    if (!this._usuarioLogado || !this._usuarioToken) {
      console.log('Nom está autenticado');
    }
    return !!this._usuarioLogado && !!this._usuarioToken;
  }
}
