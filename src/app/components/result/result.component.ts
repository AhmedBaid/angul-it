import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../core/service/state.service';
import { INITIAL_STATE } from '../../core/constant/constant';

@Component({
  selector: 'app-result',
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent {
  router = inject(Router);
  stateService = inject(StateService);
  retryChallenge() {
    this.stateService.saveState(INITIAL_STATE);
    this.router.navigate(['/captcha']);
  }
}
