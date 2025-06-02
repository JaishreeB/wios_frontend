import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';
import { LoginService, LoginUser } from '../login.service';

@Component({
  selector: 'login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private myservice: LoginService, private router: Router, private commonService: CommonServiceService) { }
  
  authLogin(form: NgForm): any {
    // console.log("logged in ................")
    // console.log(form.value)
    // this.myservice.LoginUser(form.value).subscribe(response=>{console.log("JWT"+response);localStorage.setItem("token",response)});
    // this.router.navigate([""])
    // console.log("validate function calling.......");
    // console.log(form.value);

    this.myservice.LoginUser(form.value).subscribe({
      next: (response) => {
        localStorage.setItem("username",form.value.username)
        localStorage.setItem("token", response);
        
        console.log("Login successful:", response);
        this.router.navigate([""]);
        
        this.commonService.startTokenTimer();
      },
      error: (err) => {
        if (err.status === 403) {
          alert("Invalid credentials. Please try again.");
        } else {
          alert("Something went wrong. Please try later.");
        }
      }
    });
  }



}

