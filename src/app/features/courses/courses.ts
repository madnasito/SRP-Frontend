import { ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../core/services/course/course-service';
import { Course } from '../../core/interfaces/course/course.interface';
import { CreateCourseDto } from '../../core/interfaces/course/create-course.dto';
import { EditCourseDto } from '../../core/interfaces/course/edit-course.dto';
import { CreateLessonDto } from '../../core/interfaces/course/create-lesson.dto';
import { CourseWithLessons } from '../../core/interfaces/course/course-with-lessons.interface';
import { Lesson } from '../../core/interfaces/course/lesson.interface';
import { ToastService } from '../../shared/services/toast.service';
import { environment } from '../../../environments/environment.debug';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses implements OnInit {
  private courseService = inject(CourseService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;

  courses: Course[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  apiUrl = environment.apiUrl;

  // Modals state
  showCourseModal = false;
  showLessonModal = false;
  showManageLessonsModal = false;
  isEditingCourse = false;

  // Current states
  selectedCourse: CourseWithLessons | null = null;
  currentCourseId: number | null = null;
  selectedFile: File | null = null;

  // Forms
  courseForm: FormGroup;
  lessonForm: FormGroup;

  constructor() {
    this.courseForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.lessonForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      videoUrl: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data.map(c => {
          let url = c.imageUrl;
          if (url && !url.startsWith('http')) {
            const apiBase = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
            const imagePath = url.startsWith('/') ? url : `/${url}`;
            url = `${apiBase}${imagePath}`;
          }
          return { ...c, imageUrl: url };
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.showError('Error al cargar los cursos');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Course Actions
  openCreateCourseModal(): void {
    this.isEditingCourse = false;
    this.courseForm.reset();
    this.selectedFile = null;
    this.showCourseModal = true;
    this.cdr.detectChanges();
  }

  openEditCourseModal(course: Course): void {
    this.isEditingCourse = true;
    this.selectedFile = null;
    this.courseForm.patchValue({
      id: course.id,
      title: course.title,
      description: course.description
    });
    this.showCourseModal = true;
    this.cdr.detectChanges();
  }

  closeCourseModal(): void {
    this.showCourseModal = false;
    this.cdr.detectChanges();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveCourse(): void {
    if (this.courseForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.courseForm.get('title')?.value);
    formData.append('description', this.courseForm.get('description')?.value);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditingCourse) {
      formData.append('id', this.courseForm.get('id')?.value);
      this.courseService.editCourse(formData).subscribe({
        next: () => {
          this.showSuccess('Curso actualizado con éxito');
          this.loadCourses();
          this.closeCourseModal();
        },
        error: (err) => this.showError('Error al actualizar el curso')
      });
    } else {
      if (!this.selectedFile) {
        this.showError('La imagen es obligatoria para nuevos cursos');
        return;
      }
      this.courseService.createCourse(formData).subscribe({
        next: () => {
          this.showSuccess('Curso creado con éxito');
          this.loadCourses();
          this.closeCourseModal();
        },
        error: (err) => this.showError('Error al crear el curso')
      });
    }
  }

  deleteCourse(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.showSuccess('Curso eliminado');
          this.loadCourses();
        },
        error: (err) => this.showError('Error al eliminar el curso')
      });
    }
  }

  // Lesson Management
  openManageLessons(courseId: number): void {
    this.currentCourseId = courseId;
    this.courseService.getCourseWithLessons(courseId).subscribe({
      next: (course) => {
        this.selectedCourse = course;
        this.showManageLessonsModal = true;
        this.cdr.detectChanges();
      },
      error: (err) => this.showError('Error al cargar las lecciones')
    });
  }

  closeManageLessons(): void {
    this.showManageLessonsModal = false;
    this.selectedCourse = null;
    this.cdr.detectChanges();
  }

  openAddLessonModal(): void {
    this.lessonForm.reset();
    this.showLessonModal = true;
    this.cdr.detectChanges();
  }

  closeLessonModal(): void {
    this.showLessonModal = false;
    this.cdr.detectChanges();
  }

  saveLesson(): void {
    if (this.lessonForm.invalid || !this.currentCourseId) return;

    const createLessonDto: CreateLessonDto = {
      ...this.lessonForm.value,
      course: this.currentCourseId
    };

    this.courseService.createLesson(createLessonDto).subscribe({
      next: () => {
        this.showSuccess('Lección añadida');
        this.openManageLessons(this.currentCourseId!);
        this.closeLessonModal();
      },
      error: (err) => this.showError('Error al añadir la lección')
    });
  }

  deleteLesson(lessonId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      this.courseService.deleteLesson(lessonId).subscribe({
        next: () => {
          this.showSuccess('Lección eliminada');
          if (this.currentCourseId) this.openManageLessons(this.currentCourseId);
        },
        error: (err) => this.showError('Error al eliminar la lección')
      });
    }
  }

  // Toast Helpers
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
