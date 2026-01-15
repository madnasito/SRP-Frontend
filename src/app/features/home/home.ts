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
  loading = true;

  ngOnInit(): void {
    console.log('Home component initializing...');
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        console.log('Courses loaded:', courses);
        this.courses = courses.filter(c => c.active);
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  navigateToCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }
}
