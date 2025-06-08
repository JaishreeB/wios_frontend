import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonServiceService } from './common-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const commonService=inject(CommonServiceService)
  const router = inject(Router);
  if(commonService.getUserRole()=="ADMIN"){
    return true;
    }
    else{
      router.navigate(['']);
      return false;
    }
};
