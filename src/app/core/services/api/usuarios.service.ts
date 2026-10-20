import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoMeta } from '../../../shared/models/base-dados';
import { Usuario, DadosLogueo, AltaUsuario, UsuarioData } from '@interfaces';

// @Injectable({
//   providedIn: 'root',
// })
// sustituido polo de abaixo, para limitalo ao ciclo de vida de certos compontes
// com @Service({ autoProvided: false }) significa que o servizo non se rexistra de forma automática
// no injector global da aplicación (root). Neste caso também há que meter:
// providers: [EstadisticasService],
// @Service() == @Service({ autoProvided: true })
@Service()
export class UsuariosService {

  private rotaIntermedia = '/Usuarios';

  private http = inject(HttpClient);

  getUsuarioPorNome(nome: string): Observable<UsuarioData<Usuario>> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<UsuarioData<Usuario>>(`${environment.apiUrl}${this.rotaIntermedia}/UsuarioPorNome`, { params });
  }

  postUsuario(usuario: AltaUsuario): Observable<ResultadoMeta> {
    console.debug('engadindo usuario...');
    return this.http.post<ResultadoMeta>(`${environment.apiUrl}${this.rotaIntermedia}/Usuario`, usuario);
  }

  postLogin(usuario: Usuario): Observable<DadosLogueo> {
    return this.http.post<DadosLogueo>(environment.apiUrl + '/login', usuario);
  }
}
