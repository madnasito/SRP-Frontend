import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDto } from '../../core/interfaces/auth/login.interface';
import { LoginResp } from '../../core/interfaces/auth/login-resp.interface';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  public errorMessage: string = '';
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
  ){
    
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginDto = this.loginForm.value as LoginDto;
      this.authService.login(loginDto).subscribe({
        next: (response: LoginResp ) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
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
		this.toastService.show({ template, classname: 'bg-danger text-light', delay: 1500 });
	}
}
