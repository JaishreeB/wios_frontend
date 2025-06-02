import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { FooterComponent } from './footer/footer.component';
import { FeaturesComponent } from './features/features.component';
import { RegistrationComponent } from './registration/registration.component';
import { CommonServiceService } from './common-service.service';
import { LoginService } from './login.service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent,LandingComponent,FooterComponent,FeaturesComponent,RegistrationComponent,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wios_frontend';
  // constructor(private commonService:CommonServiceService,private loginService:LoginService){
  //       if(this.commonService.isTokenExpired){
  //         alert("Your session expired,please login again!!")
  //         this.loginService.logout();
  //       }
  // }
}
