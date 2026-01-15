import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth';
import { UserService } from '../../core/services/user/user-service';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserDto } from '../../core/interfaces/user/user.dto';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);

  currentUser: UserDto | null = null;
  private userSubscription?: Subscription;

  @ViewChild('successTpl') successTpl!: TemplateRef<any>;
  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;

  errorMessage = '';

  // Form for updating user info
  profileForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  // Form for updating password
  passwordForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user) => {
        this.currentUser = user;
        if (user) {
          this.profileForm.patchValue({
            name: user.name,
            email: user.email
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      const updateData = this.profileForm.value as { name: string; email: string };
      this.userService.updateUser(updateData).subscribe({
        next: (updatedUser) => {
          // Update the user in localStorage and state
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.authService.checkSession();
          this.showSuccess(this.successTpl, '¡Perfil actualizado con éxito!');
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al actualizar perfil';
          this.showDanger(this.dangerTpl);
        }
      });
    }
  }

  onUpdatePassword(): void {
    if (this.passwordForm.valid) {
      const passwordData = this.passwordForm.value as { password: string };
      this.userService.updatePassword(passwordData).subscribe({
        next: () => {
          this.passwordForm.reset();
          this.showSuccess(this.successTpl, '¡Contraseña actualizada con éxito!');
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al actualizar contraseña';
          this.showDanger(this.dangerTpl);
        }
      });
    }
  }

  successMessage = '¡Operación exitosa!';

  showSuccess(template: TemplateRef<any>, message: string): void {
    this.successMessage = message;
    this.toastService.show({ template, classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(template: TemplateRef<any>): void {
    this.toastService.show({ template, classname: 'bg-danger text-light', delay: 15000 });
  }
}
