import { Component, inject, OnInit, ChangeDetectorRef, PLATFORM_ID, ViewChild, TemplateRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user/user-service';
import { UserDto } from '../../core/interfaces/user/user.dto';
import { ToastService } from '../../shared/services/toast.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;

  users: UserDto[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  // Modal State
  showPasswordModal = false;
  selectedUser: UserDto | null = null;
  passwordForm: FormGroup;

  constructor() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
    } else {
      this.loading = false;
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.showError('Error al cargar los usuarios');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openPasswordModal(user: UserDto): void {
    this.selectedUser = user;
    this.passwordForm.reset();
    this.showPasswordModal = true;
    this.cdr.detectChanges();
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.selectedUser = null;
    this.cdr.detectChanges();
  }

  updatePassword(): void {
    if (this.passwordForm.invalid || !this.selectedUser) return;

    this.userService.updateUserPassword({
      userId: this.selectedUser.id,
      password: this.passwordForm.value.password
    }).subscribe({
      next: () => {
        this.showSuccess(`Contraseña de ${this.selectedUser?.name} actualizada`);
        this.closePasswordModal();
        this.loadUsers();
      },
      error: (error) => {
        this.showError('Error al actualizar la contraseña');
      }
    });
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.toastService.show({
      template: this.successTpl,
      classname: 'bg-success text-light',
      delay: 3000
    });
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.toastService.show({
      template: this.dangerTpl,
      classname: 'bg-danger text-light',
      delay: 5000
    });
  }
}
