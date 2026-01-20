import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.debug';
import { UpdateUserDto } from '../../interfaces/user/update-user.dto';
import { UpdatePasswordDto } from '../../interfaces/user/update-password.dto';
import { UserDto } from '../../interfaces/user/user.dto';
import { Observable } from 'rxjs';
import { UpdateUserPasswordDto } from '../../interfaces/user/update-user-password.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = `${environment.apiUrl}/user`;

  private getAuthHeaders(): Record<string, string> | undefined {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return undefined;
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  
  updateUser(updateUserDto: UpdateUserDto): Observable<UserDto> {
    const headers = this.getAuthHeaders();
    return this.http.patch<UserDto>(`${this.baseUrl}/edit`, updateUserDto, 
      headers ? { headers } : {}
    );
  }

  updatePassword(updatePasswordDto: UpdatePasswordDto): Observable<UserDto>{
    const headers = this.getAuthHeaders();
    return this.http.patch<UserDto>(`${this.baseUrl}/update-password`, updatePasswordDto, 
      headers ? { headers } : {}
    );
  }

  updateUserPassword(payload: UpdateUserPasswordDto): Observable<UserDto> {
    const headers = this.getAuthHeaders();
    return this.http.patch<UserDto>(`${this.baseUrl}/admin-update-password`, payload, 
      headers ? { headers } : {}
    );
  }

  getAllUsers(): Observable<UserDto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserDto[]>(`${this.baseUrl}/all`, 
      headers ? { headers } : {}
    );
  }

  deactivateUser(userId: number) {
    const headers = this.getAuthHeaders();
    return this.http.delete<UserDto>(`${this.baseUrl}/deactivate`,
      {
        params: {
          id: userId.toString(),
        },
        headers
      },
    );
  }

  activeUser(userId: number) {
    const headers = this.getAuthHeaders();
    return this.http.delete<UserDto>(`${this.baseUrl}/activate`,
      {
        params: {
          id: userId.toString(),
        },
        headers
      },
    );
  }
}
