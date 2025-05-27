import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private router:Router,private commonService:CommonServiceService) { }
  validate(form:NgForm){
    console.log("logged in.......")
    console.log(form)
    console.log(form.value)
    var uname= localStorage.getItem("username")
    var psw=localStorage.getItem("password")
    if(uname==form.value.username && psw==form.value.password){
      this.commonService.login()
      console.log("logged in")
      this.router.navigate([""])
    }
  }


}

