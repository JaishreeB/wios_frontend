import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {
    path="http://localhost:9090/auth/new"
    user:User;
  constructor(private client:HttpClient) { }
  public registerUser(user:User){
    console.log("ins service add");
    console.log(user);
    return this.client.post(this.path, user,{responseType:'text'}); 
  }
}

export class User{
  name:string;
  email:string;
  password:string;
  roles:string;
}
