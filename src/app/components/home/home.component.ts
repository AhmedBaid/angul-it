import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../core/service/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  router = inject(Router);
  StateService = inject(StateService);
  ngOnInit(): void {
    this.StateService.removeState();
  }
  goToCaptcha() {
    this.router.navigate(['captcha']);
    this.StateService.saveState({ level: 1, completedChallenges: [] });
  }
}
