import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _estaAutenticado = true;

  // // Método para simular la autenticación
  // login() {
  //   this._estaAutenticado = true;
  // }

  // // Método para simular el cierre de sesión
  // logout() {
  //   this._estaAutenticado = false;
  // }

  // Método para verificar si el usuario está autenticado
  estaAutenticado(rota: string): boolean {
    /* if (rota.includes('livros')) {              // página nom permitida
      return false;
    } */
    return this._estaAutenticado;
  }
}
