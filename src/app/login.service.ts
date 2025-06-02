import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { CommonServiceService } from './common-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  path="http://localhost:9090/auth/authenticate"

  constructor(private client:HttpClient,private router:Router,private commonService:CommonServiceService) { }
  public LoginUser(loginUser: LoginUser) {
    console.log("ins service add");
    console.log(loginUser.name);
    console.log()
    return this.client.post(this.path, loginUser,{responseType:'text'}).pipe(
      tap(()=>{
        sessionStorage.setItem("username",loginUser.name)
        console.log("username setted in local storage",loginUser.name)
        this.isLoggedIn=true
    }));  
  }
  isLoggedIn:boolean=false

  logout():boolean{
    this.isLoggedIn=false
    sessionStorage.clear()
    this.router.navigate(["/login"])
    this.commonService.clearTokenTimer();
    return this.isLoggedIn
  }

  getLoginStatus(): boolean{
    return this.isLoggedIn;
  }
}

export class LoginUser{
  name:string;
  password:string;
}
