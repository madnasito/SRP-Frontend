import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { CreateContactMessageDto } from '../../interfaces/contact-messages/create-message.dto';
import { ContactMessageResponse } from '../../interfaces/contact-messages/contact-message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private baseUrl = `${environment.apiUrl}/contact`;

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

  createMessage(message: CreateContactMessageDto) {
    const headers = this.getAuthHeaders();
    return this.http.post<ContactMessageResponse>(`${this.baseUrl}/create-message`, message,
      headers ? { headers } : {}
    );
  }

  getMessages(page: number, limit: number = 20) {
    const headers = this.getAuthHeaders();
    return this.http.get<ContactMessageResponse>(`${this.baseUrl}/messages`, {
      params: {
        page: page,
        limit: limit,
      },
      ...(headers ? { headers } : {})
    });
  }
}
