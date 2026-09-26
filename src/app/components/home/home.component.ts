import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  router = inject(Router);
  goToCaptcha() {
    this.router.navigate(["captcha"])
  }
}
