import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';

@Component({
  selector: 'header',
  imports: [RouterOutlet,RouterLink,RegistrationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
