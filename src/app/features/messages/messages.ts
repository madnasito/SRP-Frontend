import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../../core/services/contact-messages/contact-service';
import { ContactMessageResponse } from '../../core/interfaces/contact-messages/contact-message-response.interface';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages implements OnInit {
  private contactService = inject(ContactService);
  private cdr = inject(ChangeDetectorRef);

  messages: ContactMessageResponse[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.contactService.getMessages().subscribe({
      next: (data) => {
        this.messages = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading messages', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
