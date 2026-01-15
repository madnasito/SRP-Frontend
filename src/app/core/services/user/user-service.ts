import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { UpdateUserDto } from '../../interfaces/user/update-user.dto';
import { UpdatePasswordDto } from '../../interfaces/user/update-password.dto';
import { UserDto } from '../../interfaces/user/user.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/user`;

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  
  updateUser(updateUserDto: UpdateUserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.baseUrl}/edit`, updateUserDto, {
      headers: this.getAuthHeaders()
    });
  }

  updatePassword(updatePasswordDto: UpdatePasswordDto): Observable<UserDto>{
    return this.http.patch<UserDto>(`${this.baseUrl}/update-password`, updatePasswordDto, {
      headers: this.getAuthHeaders()
    });
  }
}
