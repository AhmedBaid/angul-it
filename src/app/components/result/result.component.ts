import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent {
  router = inject(Router);
  retryChallenge() {
    this.router.navigate(['/captcha']);
  }
}
