import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseCliente } from '../shared/models/interfaces/responses/clientes/ResponseCliente';
import { RequestCliente } from '../shared/models/interfaces/requests/clientes/RequestCliente';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  http = inject(HttpClient);
  cookie = inject(CookieService);
  API_URL = environment.Aquiles_URL;
  private JWT_TOKEN = this.cookie.get('USUARIO_INFORMACOES');
  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type':'application/json',
      Authorization : `Bearer ${this.JWT_TOKEN}`,
    })
  };

  postCliente(request: RequestCliente): Observable<ResponseCliente> {
    return this.http.post<ResponseCliente>(`${this.API_URL}/clientes`, request, this.httpOptions);
  }

  getClientes(pageNumber: number, pageSize: number, search: string = ''): Observable<ResponseCliente> {
    return this.http.get<ResponseCliente>(`${this.API_URL}/clientes?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`, this.httpOptions);
  }

  putCliente(id: string, request: RequestCliente): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/clientes/${id}`, request, this.httpOptions);
  }

  ativarInativarCliente(id: string): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/clientes/${id}`, {}, this.httpOptions);
  }
}
