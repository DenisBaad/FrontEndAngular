import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestUsuario } from '../shared/models/interfaces/requests/usuarios/RequestUsuario';
import { Observable, take } from 'rxjs';
import { environment } from '../../environment/environment.prod';
import { ResponseUsuario } from '../shared/models/interfaces/responses/usuarios/ResponseUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private API_URL = environment.Aquiles_URL;

  constructor(private http: HttpClient) { }

  postUsuario(request: RequestUsuario): Observable<ResponseUsuario> {
    return this.http.post<ResponseUsuario>(`${this.API_URL}/usuarios`, request).pipe(take(1));
  }
}
