import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../../interfaces/auth/login.interface';
import { LoginResp } from '../../interfaces/auth/login-resp.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/auth`;

  login(loginDto: LoginDto) {
    try {
      return this.http.post<LoginResp>(`${this.baseUrl}/login`, loginDto);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
