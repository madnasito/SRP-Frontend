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
    this.courseService.getCourseWithLessons(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openVideoModal(url: string, lessonId: number): void {
    const embedUrl = this.getYouTubeEmbedUrl(url);
    this.selectedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.isModalOpen = true;
    
    // Mark lesson as complete
    this.courseService.completeLesson(this.courseId, lessonId).subscribe({
      next: () => {
        // We could refresh course data here if we had completion indicators in the UI
        console.log(`Lesson ${lessonId} marked as complete`);
      },
      error: (error) => {
        console.error('Error marking lesson as complete:', error);
      }
    });

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
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    }

    // Use youtube-nocookie.com which often helps with embedding issues and privacy
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`;
  }
}
