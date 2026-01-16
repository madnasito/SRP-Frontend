import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CourseService } from '../../core/services/course/course-service';
import { Course } from '../../core/interfaces/course/course.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private courseService = inject(CourseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  courses: Course[] = [];
  chunkedCourses: Course[][] = [];
  loading = true;

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses.filter(c => c.active);
        this.chunkedCourses = this.chunkArray(this.courses, 3);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
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
