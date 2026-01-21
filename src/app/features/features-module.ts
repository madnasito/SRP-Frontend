import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Home } from './home/home';
import { Faq } from './faq/faq';
import { MyProgress } from './my-progress/my-progress';
import { Profile } from './profile/profile';
import { Ask } from './ask/ask';
import { Login } from './login/login';
import { Register } from './register/register';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastsContainer } from '../shared/atoms/atom-toast-container';
import { Course } from './course/course';
import { Courses } from './courses/courses';
import { Messages } from './messages/messages';
import { Users } from './users/users';
import { Category } from './category/category';


@NgModule({
  declarations: [
    Home, Faq, MyProgress, Profile, Ask, Login, Register, Course, Courses, Messages, Users,
    Category
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ToastsContainer
  ]
})
export class FeaturesModule { }
