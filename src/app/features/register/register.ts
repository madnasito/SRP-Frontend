import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { RegisterDto } from '../../core/interfaces/auth/register.dto';
import { RegisterResp } from '../../core/interfaces/auth/register-resp.interface';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  public errorMessage: string = '';
  public successMessage: string = '';
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    
  });

  constructor(
    private router: Router,
  ){}

  onSubmit() {
    if (this.registerForm.valid) {
      const registerDto = this.registerForm.value as RegisterDto;
      this.authService.register(registerDto).subscribe({
        next: (response: RegisterResp ) => {
          this.successMessage = `Usuario ${response.user.name} registrado con éxito`;
          this.showSuccess(this.successTpl);
          this.registerForm.reset();
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
		this.toastService.show({ template, classname: 'bg-danger text-light', delay: 5000 });
	}

  showSuccess(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-success text-light', delay: 5000 });
	}
}
