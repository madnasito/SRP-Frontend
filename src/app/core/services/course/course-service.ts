import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.debug';
import { CreateCourseDto } from '../../interfaces/course/create-course.dto';
import { Course } from '../../interfaces/course/course.interface';
import { Observable } from 'rxjs';
import { CreateLessonDto } from '../../interfaces/course/create-lesson.dto';
import { Lesson } from '../../interfaces/course/lesson.interface';
import { CourseWithLessons } from '../../interfaces/course/course-with-lessons.interface';
import { ProgressModel } from '../../interfaces/course/progress-model.interface';
import { CompletedLessonResponse } from '../../interfaces/course/completed-lesson-resp.interface';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiUrl}/course`;

  private token = localStorage.getItem('token');

  private authorization = `Bearer ${this.token}`;

  createCourse(course: CreateCourseDto){
    return this.http.post<Course>(`${this.baseUrl}/create-course`, course, { headers: { Authorization: this.authorization } });
  }

  createLesson(lesson: CreateLessonDto){
    return this.http.post<Lesson>(`${this.baseUrl}/create-lesson`, lesson, { headers: { Authorization: this.authorization } });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/all-courses`);
  }

  getAllLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.baseUrl}/all-lessons`, { headers: { Authorization: this.authorization } });
  }

  getCourseWithLessons(id: number): Observable<CourseWithLessons> {
    return this.http.get<CourseWithLessons>(`${this.baseUrl}/with-lessons`, { params: { id } });
  }

  getMyProgress(): Observable<ProgressModel[]> {
    return this.http.get<ProgressModel[]>(`${this.baseUrl}/my-progress`,
      {headers: { Authorization: this.authorization }}
    );
  }

  completeLesson(courseId: number, lessonId: number): Observable<CompletedLessonResponse> {
    return this.http
    .get<CompletedLessonResponse>
    (`${this.baseUrl}/complete-lesson/${courseId}/${lessonId}`,
      { headers: { Authorization: this.authorization } }
    );
  }
}
