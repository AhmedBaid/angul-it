import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../core/service/state.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent {
  router = inject(Router);
  stateService = inject(StateService);
  retryChallenge() {
    this.router.navigate(['/captcha']);
    this.stateService.removeState();
  }
}
