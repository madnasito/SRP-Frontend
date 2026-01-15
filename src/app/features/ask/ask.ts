import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ContactService } from '../../core/services/contact-messages/contact-service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { CreateContactMessageDto } from '../../core/interfaces/contact-messages/create-message.dto';

@Component({
  selector: 'app-ask',
  standalone: false,
  templateUrl: './ask.html',
  styleUrl: './ask.scss',
})
export class Ask {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly toastService = inject(ToastService);

  public errorMessage: string = '';
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;

  contactForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    content: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
  ){ }

  onSubmit() {
    if (this.contactForm.valid) {
      const contactDto = this.contactForm.value as CreateContactMessageDto;
      this.contactService.createMessage(contactDto).subscribe({
        next: () => {
          this.contactForm.reset();
          this.showSuccess(this.successTpl);
        },
        error: (error: any) => {
          if(error.statusText) {
            this.errorMessage = error.error.message;
            this.showDanger(this.dangerTpl);
          }
        }
      });
    }
  }

  showDanger(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-danger text-light', delay: 15000 });
  }

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({ template, classname: 'bg-success text-light', delay: 5000 });
  }

}
