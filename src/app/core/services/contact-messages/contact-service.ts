import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { HttpClient } from '@angular/common/http';
import { CreateContactMessageDto } from '../../interfaces/contact-messages/create-message.dto';
import { ContactMessageResponse } from '../../interfaces/contact-messages/contact-message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/contact`;

  createMessage(message: CreateContactMessageDto) {
    return this.http.post<ContactMessageResponse>(`${this.baseUrl}/create-message`, message);
  }

  getMessages() {
    return this.http.get<ContactMessageResponse[]>(`${this.baseUrl}/messages`);
  }
}
