import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink,RegistrationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private commonService:CommonServiceService){}
  logout(){
    localStorage.clear()
    return this.commonService.logout();
   }
 
  get isLogedIn(): boolean{
    return this.commonService.getLoginStatus();
  }

}
