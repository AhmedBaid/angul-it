import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { CaptchaComponent } from './components/captcha/captcha';
import { ResultComponent } from './components/result/result';
import { resultGuard } from './guards/result.guard';

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
    canActivate: [resultGuard],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
