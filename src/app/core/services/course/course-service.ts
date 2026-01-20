import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment.debug';
import { CreateCourseDto } from '../../interfaces/course/create-course.dto';
import { Course } from '../../interfaces/course/course.interface';
import { Observable } from 'rxjs';
import { CreateLessonDto } from '../../interfaces/course/create-lesson.dto';
import { Lesson } from '../../interfaces/course/lesson.interface';
import { CourseWithLessons } from '../../interfaces/course/course-with-lessons.interface';
import { ProgressModel } from '../../interfaces/course/progress-model.interface';
import { CompletedLessonResponse } from '../../interfaces/course/completed-lesson-resp.interface';
import { EditCourseDto } from '../../interfaces/course/edit-course.dto';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = `${environment.apiUrl}/course`;

  private getAuthHeaders(): Record<string, string> | undefined {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      return undefined;
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  createCourse(course: CreateCourseDto){
    const headers = this.getAuthHeaders();
    return this.http.post<Course>(`${this.baseUrl}/create-course`, course, 
      headers ? { headers } : {}
    );
  }

  createLesson(lesson: CreateLessonDto){
    const headers = this.getAuthHeaders();
    return this.http.post<Lesson>(`${this.baseUrl}/create-lesson`, lesson, 
      headers ? { headers } : {}
    );
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/all-courses`);
  }

  getAllLessons(): Observable<Lesson[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Lesson[]>(`${this.baseUrl}/all-lessons`, 
      headers ? { headers } : {}
    );
  }

  getCourseWithLessons(id: number): Observable<CourseWithLessons> {
    return this.http.get<CourseWithLessons>(`${this.baseUrl}/with-lessons`, { params: { id } });
  }

  getMyProgress(): Observable<ProgressModel[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProgressModel[]>(`${this.baseUrl}/my-progress`, 
      headers ? { headers } : {}
    );
  }

  completeLesson(courseId: number, lessonId: number): Observable<CompletedLessonResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<CompletedLessonResponse>(
      `${this.baseUrl}/complete-lesson/${courseId}/${lessonId}`, 
      headers ? { headers } : {}
    );
  }

  deleteCourse(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, 
      headers ? { headers } : {}
    );
  }

  deleteLesson(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/lesson/${id}`, 
      headers ? { headers } : {}
    );
  }

  getUserProgress(id: number): Observable<ProgressModel[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProgressModel[]>(`${this.baseUrl}/user-progress`, {
      params: { id },
      ...(headers ? { headers } : {})
    });
  }

  editCourse(course: EditCourseDto): Observable<Course> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Course>(`${this.baseUrl}/edit-course`, course, 
      headers ? { headers } : {}
    );
  }
}
