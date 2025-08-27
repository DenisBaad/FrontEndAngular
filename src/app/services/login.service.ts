import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { ResponseLogin } from '../shared/models/interfaces/responses/login/ResponseLogin';
import { RequestLogin } from '../shared/models/interfaces/requests/login/RequestLogin';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private API_URL = environment.Aquiles_URL;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  login(request: RequestLogin): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>(`${this.API_URL}/login`, request).pipe(take(1));
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USUARIO_INFORMACOES');
    return JWT_TOKEN ? true : false;
  }
}
