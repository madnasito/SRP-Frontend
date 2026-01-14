import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../../interfaces/auth/login.interface';
import { LoginResp } from '../../interfaces/auth/login-resp.interface';
import { RegisterResp } from '../../interfaces/auth/register-resp.interface';
import { RegisterDto } from '../../interfaces/auth/register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/auth`;

  login(loginDto: LoginDto) {
    try {
      return this.http.post<LoginResp>(`${this.baseUrl}/sign-in`, loginDto);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  register(registerDto: RegisterDto) {
    try {
      return this.http.post<RegisterResp>(`${this.baseUrl}/sign-up`, registerDto);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
