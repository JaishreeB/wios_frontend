import { Component } from '@angular/core';
import { FeaturesComponent } from '../features/features.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'landing',
  imports: [FeaturesComponent,RouterLink,RouterOutlet,FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  
}
