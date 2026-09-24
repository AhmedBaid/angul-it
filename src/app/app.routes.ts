import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { CaptchaComponent } from './components/captcha/captcha';
import { ResultComponent } from './components/result/result';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'captcha',
    component: CaptchaComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
