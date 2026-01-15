import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Faq } from './features/faq/faq';
import { Ask } from './features/ask/ask';
import { Login } from './features/login/login';
import { Register } from './features/register/register';
import { Profile } from './features/profile/profile';
import { MyProgress } from './features/my-progress/my-progress';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'faq',
        component: Faq
    },
    {
        path: 'ask',
        component: Ask
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'my-progress',
        component: MyProgress
    },
    {
        path: 'profile',
        component: Profile
    }
];
