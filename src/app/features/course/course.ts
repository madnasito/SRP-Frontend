import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from '../../core/services/course/course-service';
import { CourseWithLessons } from '../../core/interfaces/course/course-with-lessons.interface';

@Component({
  selector: 'app-course',
  standalone: false,
  templateUrl: './course.html',
  styleUrl: './course.scss',
})
export class Course implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  course: CourseWithLessons | null = null;
  loading = true;
  courseId: number = 0;
  
  selectedVideoUrl: SafeResourceUrl | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      this.loadCourse();
    });
  }

  loadCourse(): void {
    console.log('Loading course with ID:', this.courseId);
    this.courseService.getCourseWithLessons(this.courseId).subscribe({
      next: (course) => {
        console.log('Course loaded:', course);
        this.course = course;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openVideoModal(url: string): void {
    const embedUrl = this.getYouTubeEmbedUrl(url);
    this.selectedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  closeVideoModal(): void {
    this.isModalOpen = false;
    this.selectedVideoUrl = null;
    this.cdr.detectChanges();
  }

  private getYouTubeEmbedUrl(url: string): string {
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already an embed URL
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
}
