import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RegisterService } from '../register.service';
 
@Component({
  selector: 'registration',
  imports: [ReactiveFormsModule, CommonModule,RouterLink,RouterOutlet],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
 
  constructor(private fb: FormBuilder,private router:Router,private myservice:RegisterService) { }
 
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      roles: ['USER', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
 
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password').value;
    const passwordRepeat = form.get('passwordRepeat').value;
    return password === passwordRepeat ? null : { mismatch: true };
  }
 
  onSubmit(form): void {
    if (this.registrationForm.valid) {
      // sessionStorage.setItem("username",form.get("username").value)
      // sessionStorage.setItem("password",form.get("password").value)
      console.log('Form Submitted!', this.registrationForm.value);
      this.myservice.registerUser(form.value).subscribe(response=>{console.log(response)});
      this.router.navigate(["/login"])
    }
  }
 
  onReset(): void {
    this.registrationForm.reset();
  }
}
 