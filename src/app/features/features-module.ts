import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Home } from './home/home';
import { Faq } from './faq/faq';
import { MyProgress } from './my-progress/my-progress';
import { Profile } from './profile/profile';
import { Ask } from './ask/ask';
import { Login } from './login/login';



@NgModule({
  declarations: [
    Home, Faq, MyProgress, Profile, Ask, Login
  ],
  imports: [
    CommonModule
  ]
})
export class FeaturesModule { }
