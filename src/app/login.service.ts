import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginUser:LoginUser;
  path="http://localhost:1121/auth/authenticate"

  constructor(private client:HttpClient) { }

  public LoginUser(loginUser: LoginUser) {
    console.log("ins service add");
    console.log(loginUser);
    console.log()
    return this.client.post(this.path, loginUser,{responseType:'text'});
    
  }

}
export class LoginUser{
  name:string;
  password:string;
}
