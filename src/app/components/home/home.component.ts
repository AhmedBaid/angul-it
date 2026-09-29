import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../core/service/state.service';
import { INITIAL_STATE } from '../../core/constant/constant';

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
    this.router.navigate(['/captcha']);
    this.StateService.saveState(INITIAL_STATE);
  }
}
