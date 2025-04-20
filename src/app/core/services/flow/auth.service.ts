import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment, environments } from '../../../../environments/environment';
import { Usuario, DadosLogueo, UsuarioLogado } from '../../models/usuario.interface';
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

  postLogin(usuario: Usuario): Observable<DadosLogueo> {
    return this.http.post(environment.apiUrl + '/login', usuario).pipe(
      map((response: any) => response as DadosLogueo), // Cast the response to DadosLogueo
      tap(response => {
        console.log('LoginService - postLogin - response:', response);
        if (response.token) {
          this._usuarioLogado = response.usuario;
          this._usuarioToken = response.token;
          // localStorage.setItem('authToken', response.token);
          // localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
      })
    );
  }
}
