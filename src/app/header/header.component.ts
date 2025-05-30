import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginService } from '../login.service';
import { ZoneComponent } from '../zone/zone.component';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink,RegistrationComponent,ZoneComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  constructor(private loginService:LoginService){}
  logout(){
    localStorage.clear() 
    return this.loginService.logout();
   }
 
  get isLogedIn(): boolean{
    return this.loginService.getLoginStatus();
  }

}
