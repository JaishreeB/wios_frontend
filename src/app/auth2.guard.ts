import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonServiceService } from './common-service.service';
import { LoginService } from './login.service';

export const auth2Guard: CanActivateFn = (route, state) => {
  const commonService = inject(CommonServiceService);
  const loginService = inject(LoginService);
  const router = inject(Router);
  if(commonService.getToken() || !!loginService.getLoginStatus()) {
    // Allow access if token exists or user is logged in  
    return true;
  }
  // Redirect to login if no token and not logged in
  else{
    router.navigate(['/login']);
    return false;
  }

};
