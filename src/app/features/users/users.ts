import { Component, inject, OnInit, ChangeDetectorRef, PLATFORM_ID, ViewChild, TemplateRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user/user-service';
import { AuthService } from '../../core/services/auth/auth';
import { CourseService } from '../../core/services/course/course-service';
import { UserDto } from '../../core/interfaces/user/user.dto';
import { ProgressModel } from '../../core/interfaces/course/progress-model.interface';
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
  private authService = inject(AuthService);
  private courseService = inject(CourseService);

  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;

  users: UserDto[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  // Modal State
  showPasswordModal = false;
  showProgressModal = false;
  selectedUser: UserDto | null = null;
  userProgress: ProgressModel[] = [];
  loadingProgress = false;
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
        const currentUser = this.authService.getCurrentUser();
        this.users = currentUser ? users.filter(u => u.id !== currentUser.id) : users;
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

  toggleUserStatus(user: UserDto): void {
    const action = user.active ? this.userService.deactivateUser(user.id) : this.userService.activeUser(user.id);
    const statusText = user.active ? 'desactivado' : 'activado';

    action.subscribe({
      next: () => {
        this.showSuccess(`Usuario ${user.name} ${statusText} con éxito`);
        this.loadUsers();
      },
      error: (error) => {
        console.error(`Error al ${user.active ? 'desactivar' : 'activar'} usuario:`, error);
        this.showError(`Error al ${user.active ? 'desactivar' : 'activar'} el usuario`);
      }
    });
  }

  openProgressModal(user: UserDto): void {
    this.selectedUser = user;
    this.showProgressModal = true;
    this.loadingProgress = true;
    this.userProgress = [];

    this.courseService.getUserProgress(user.id).subscribe({
      next: (progress) => {
        this.userProgress = progress;
        this.loadingProgress = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user progress:', error);
        this.showError('Error al cargar el progreso del usuario');
        this.loadingProgress = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeProgressModal(): void {
    this.showProgressModal = false;
    this.selectedUser = null;
    this.userProgress = [];
    this.cdr.detectChanges();
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
