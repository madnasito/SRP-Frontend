import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/category/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = `${environment.apiUrl}/category`;

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

  getAllCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(`${this.baseUrl}`, 
      headers ? { headers } : {}
    );
  }

  getCategoryById(id: number): Observable<Category> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category>(`${this.baseUrl}/${id}`, 
      headers ? { headers } : {}
    );
  }
}
