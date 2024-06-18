import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { CanMatchFn } from '@angular/router';

export const authMatchGuard: CanMatchFn = (route, segments) => {
  console.log("Auth Match: guarding");
  return auth(route.path || '');
};

export const authGuard: CanActivateFn = (route, state) => {
  console.log("Auth Activate: guarding");
  return auth(state.url);
};

const auth = (url: string): boolean => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  if (usersService.isLoggedIn()) {
    return true;
  }
  usersService.redirectAfterLogin = url;
  router.navigateByUrl("/login");
  return false;

}