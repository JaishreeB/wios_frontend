import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CommonServiceService } from './common-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const commonService=inject(CommonServiceService)
  if(commonService.getUserRole()=="ADMIN"){
    return true;
    }
    else{
      return false;
    }
};
