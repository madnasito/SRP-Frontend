import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../../interfaces/auth/login.interface';
import { LoginResp } from '../../interfaces/auth/login-resp.interface';
import { RegisterResp } from '../../interfaces/auth/register-resp.interface';
import { RegisterDto } from '../../interfaces/auth/register.dto';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDto } from '../../interfaces/user/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/auth`;

  // State management
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Public method to check session - call from component with platform check
  checkSession(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as UserDto;
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  login(loginDto: LoginDto): Observable<LoginResp> {
    return this.http.post<LoginResp>(`${this.baseUrl}/sign-in`, loginDto).pipe(
      tap((response: LoginResp) => {
        // Save token and user to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update state
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(registerDto: RegisterDto): Observable<RegisterResp> {
    return this.http.post<RegisterResp>(`${this.baseUrl}/sign-up`, registerDto).pipe(
      tap((response: RegisterResp) => {
        // Save token and user to localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Update state
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset state
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
