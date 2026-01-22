import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../../core/services/contact-messages/contact-service';
import { ContactMessageResponse, Message } from '../../core/interfaces/contact-messages/contact-message-response.interface';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages implements OnInit {
  private contactService = inject(ContactService);
  private cdr = inject(ChangeDetectorRef);

  messages: Message[] = [];
  loading = true;
  currentPage = 1;
  limit = 20;
  totalPages = 1;

  ngOnInit(): void {
    this.loadMessages(this.currentPage);
  }

  loadMessages(page: number): void {
    this.loading = true;
    this.contactService.getMessages(page, this.limit).subscribe({
      next: (data) => {
        this.messages = data.data;
        this.totalPages = data.meta.lastPage;
        this.currentPage = data.meta.page;
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

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadMessages(page);
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
