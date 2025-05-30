import { Routes } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ZoneComponent } from './zone/zone.component';

export const routes: Routes = [
    {path:"features", component:FeaturesComponent},
    {path:"signup",component:RegistrationComponent},
    {path:"",component:LandingComponent},
    {path:"login",component:LoginComponent},
    {path:"zone",component:ZoneComponent}
];
