import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';
import { LoginService, LoginUser } from '../login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginError: string;
  constructor(private myservice: LoginService, private router: Router, private commonService: CommonServiceService,private loginService:LoginService) { }
  
  authLogin(form: NgForm): any {

    this.myservice.LoginUser(form.value).subscribe({
      next: (response) => {
        sessionStorage.setItem("username",form.value.username)
        sessionStorage.setItem("token", response);
        
        console.log("Login successful:", response);
       
        this.router.navigate([""]);
      
        
        this.commonService.startTokenTimer();
      },
      error: (err) => {
        if (err.status === 403) {
        //  alert("Invalid credentials. Please try again.");
          this.loginError = "Invalid credentials. Please try again.";
        } else {
        //  alert("Something went wrong. Please try later.");
          this.loginError = "Invalid credentials. Please try again.";
        }
      }
    });
  }

}

