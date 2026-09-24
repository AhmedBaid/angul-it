import { CanActivateFn } from '@angular/router';

export const resultGuard: CanActivateFn = (route, state) => {
  return true;
};
