import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginService } from '../login.service';
import { ZoneComponent } from '../zone/zone.component';
import { CommonServiceService } from '../common-service.service';
import { VendorComponent } from '../vendor/vendor.component';
import { StockComponent } from '../stock/stock.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { MetricsComponent } from '../metrics/metrics.component';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink,RegistrationComponent,ZoneComponent,VendorComponent,StockComponent,TransactionComponent,MetricsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  constructor(private loginService:LoginService,private commonService:CommonServiceService){}
  logout(){
    localStorage.clear() 
    return this.loginService.logout();
   }
 
  get isAdmin():boolean{
    if(this.commonService.getUserRole()=="ADMIN"){
      return true;
    }
  }
  get isLogedIn(): boolean{
    if(this.commonService.getToken()){
      return true;
    }
    else{
      return this.loginService.getLoginStatus();
    }
  }

}
