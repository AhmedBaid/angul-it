import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../service/state.service';

export const resultGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  if (stateService.isAllCompleted()) {
    return true;
  }

  return router.navigate(['/captcha']);
};
