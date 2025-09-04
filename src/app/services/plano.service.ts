import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { ResponsePlano } from '../shared/models/interfaces/responses/planos/ResponsePlano';
import { RequestPlano } from '../shared/models/interfaces/requests/planos/RequestPlano';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
  http = inject(HttpClient);
  cookie = inject(CookieService);
  private API_URL = environment.Aquiles_URL;
  private JWT_TOKEN = this.cookie.get('USUARIO_INFORMACOES');
  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type':'application/json',
      Authorization : `Bearer ${this.JWT_TOKEN}`,
    })
  };

  Post(plano: RequestPlano): Observable<ResponsePlano> {
    return this.http.post<ResponsePlano>(`${this.API_URL}/plano`, plano,this.httpOptions);
  }

  Get(pageNumber: number, pageSize: number, search: string = ''): Observable<ResponsePlano> {
    return this.http.get<ResponsePlano>(`${this.API_URL}/plano?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`, this.httpOptions);
  }

  Put(plano: RequestPlano, id?: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/plano/${id}`, plano, this.httpOptions);
  }
}


