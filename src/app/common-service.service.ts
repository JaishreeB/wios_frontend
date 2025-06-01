import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(private router: Router) { }


  private tokenTimer: any;

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.getTokenPayload();
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  getUserRole(): string | null {
    const payload = this.getTokenPayload();
    return payload?.roles || null;
  }

  startTokenTimer(): void {
    const token = this.getToken();
    console.log("inside start timer.........")
    console.log('Token expired:', this.isTokenExpired());
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = payload.exp * 1000 - Date.now();
    // const expiresIn = 5000; 
    if (expiresIn > 0) {
      this.tokenTimer = setTimeout(() => {
        alert('Session expired. Please login again.');
        localStorage.clear()
        this.router.navigate(['/login']);
      }, expiresIn);
    }
  }

  clearTokenTimer(): void {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
  }


}

