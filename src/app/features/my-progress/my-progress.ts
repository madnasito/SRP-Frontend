import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CourseService } from '../../core/services/course/course-service';
import { ProgressModel } from '../../core/interfaces/course/progress-model.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-progress',
  standalone: false,
  templateUrl: './my-progress.html',
  styleUrl: './my-progress.scss',
})
export class MyProgress implements OnInit {
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  progressList: ProgressModel[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.courseService.getMyProgress().subscribe({
      next: (data) => {
        this.progressList = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading progress:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }
}
