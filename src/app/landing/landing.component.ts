import { Component, OnInit } from '@angular/core';
import { FeaturesComponent } from '../features/features.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'landing',
  imports: [FeaturesComponent,RouterLink,RouterOutlet,FooterComponent,CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;

  ngOnInit(): void {
    if(sessionStorage.getItem('token') != null) {
      this.isLoggedIn =true;
      this.username = sessionStorage.getItem('username');
    }
    
  }
}

