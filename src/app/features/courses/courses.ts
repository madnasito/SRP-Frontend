import { ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../core/services/course/course-service';
import { CategoryService } from '../../core/services/category/category';
import { Course } from '../../core/interfaces/course/course.interface';
import { Category } from '../../core/interfaces/category/category';
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
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  @ViewChild('dangerTpl') dangerTpl!: TemplateRef<any>;
  @ViewChild('successTpl') successTpl!: TemplateRef<any>;

  courses: Course[] = [];
  categories: Category[] = [];
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

  // Forms
  courseForm: FormGroup;
  lessonForm: FormGroup;

  constructor() {
    this.courseForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      categoryId: [null, [Validators.required]],
    });

    this.lessonForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      videoUrl: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadCategories();
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
          const categoryId = c.categoryId || (c as any).category?.id;
          return { ...c, imageUrl: url, categoryId };
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

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.showError('Error al cargar las categorías');
      }
    });
  }

  // Course Actions
  openCreateCourseModal(): void {
    this.isEditingCourse = false;
    this.courseForm.reset();
    this.showCourseModal = true;
    this.cdr.detectChanges();
  }

  openEditCourseModal(course: any): void {
    this.isEditingCourse = true;
    
    // Ensure we have a category ID, checking both direct property and nested object
    const categoryId = course.categoryId || course.category?.id;
    
    this.courseForm.patchValue({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      categoryId: categoryId
    });
    this.showCourseModal = true;
    this.cdr.detectChanges();
  }

  closeCourseModal(): void {
    this.showCourseModal = false;
    this.cdr.detectChanges();
  }



  saveCourse(): void {
    if (this.courseForm.invalid) return;

    const courseData = this.courseForm.value;

    if (this.isEditingCourse) {
      this.courseService.editCourse(courseData).subscribe({
        next: () => {
          this.showSuccess('Curso actualizado con éxito');
          this.loadCourses();
          this.closeCourseModal();
        },
        error: (err) => this.showError('Error al actualizar el curso')
      });
    } else {
      this.courseService.createCourse(courseData).subscribe({
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
