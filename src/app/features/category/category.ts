import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, makeStateKey, TransferState } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/services/category/category';
import { Category as CategoryInterface } from '../../core/interfaces/category/category';
import { CourseService } from '../../core/services/course/course-service';
import { Course } from '../../core/interfaces/course/course.interface';
import { environment } from '../../../environments/environment.debug';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  category: CategoryInterface | null = null;
  courses: Course[] = [];
  chunkedCourses: Course[][] = [];
  loading = true;
  categoryNotFound = false;
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        if (!id) {
          this.loading = false;
          return of(null);
        }

        // Keys for TransferState
        const CATEGORY_KEY = makeStateKey<CategoryInterface>(`category-${id}`);
        const COURSES_KEY = makeStateKey<Course[]>(`category-courses-${id}`);

        // Check if data exists in TransferState (Client side)
        if (this.transferState.hasKey(CATEGORY_KEY) && this.transferState.hasKey(COURSES_KEY)) {
          const category = this.transferState.get(CATEGORY_KEY, null!);
          const courses = this.transferState.get(COURSES_KEY, []);
          
          this.transferState.remove(CATEGORY_KEY);
          this.transferState.remove(COURSES_KEY);
          
          const formattedCategory = this.formatCategoryImageUrl(category);
          // Courses from TS might need formatting if not done before storage, 
          // usually we store raw response, so we format here.
          return of({ category: formattedCategory, courses });
        }

        // Reset state for new load
        this.loading = true;
        this.category = null;
        this.courses = [];
        this.chunkedCourses = [];
        this.categoryNotFound = false;
        this.cdr.detectChanges();

        return this.categoryService.getCategoryById(id).pipe(
          switchMap(category => {
            const formattedCategory = this.formatCategoryImageUrl(category);
            return this.courseService.getCourseByCategoryId(id).pipe(
              map(courses => {
                // Set data to TransferState (Server side)
                if (!isPlatformBrowser(this.platformId)) {
                  this.transferState.set(CATEGORY_KEY, category);
                  this.transferState.set(COURSES_KEY, courses);
                }
                return { category: formattedCategory, courses };
              })
            );
          }),
          catchError(error => {
            console.error('Error loading data:', error);
            this.categoryNotFound = true;
            return of(null);
          })
        );
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.category = data.category;
          this.courses = data.courses.filter(c => c.active).map(c => this.formatCourseImageUrl(c));
          this.chunkedCourses = this.chunkArray(this.courses, 3);
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatCategoryImageUrl(cat: CategoryInterface): CategoryInterface {
    let url = cat.imageUrl;
    if (url && !url.startsWith('http')) {
      const apiBase = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
      const imagePath = url.startsWith('/') ? url : `/${url}`;
      url = `${apiBase}${imagePath}`;
    }
    return { ...cat, imageUrl: url };
  }

  private formatCourseImageUrl(course: Course): Course {
    let url = course.imageUrl;
    if (url && !url.startsWith('http')) {
      const apiBase = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
      const imagePath = url.startsWith('/') ? url : `/${url}`;
      url = `${apiBase}${imagePath}`;
    }
    return { ...course, imageUrl: url };
  }

  navigateToCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  private chunkArray(array: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}
