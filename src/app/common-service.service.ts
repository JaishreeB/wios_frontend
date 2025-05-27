import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor() { }
  isLoggedIn:boolean=false
  login(){
    this.isLoggedIn=true
  }
  logout(){
    this.isLoggedIn=true
  }

 
  getLoginStatus(): boolean{
    return this.isLoggedIn;
  }
}
