import { Routes } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { RegistrationComponent } from './registration/registration.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ZoneComponent } from './zone/zone.component';
import { VendorComponent } from './vendor/vendor.component';
import { StockComponent } from './stock/stock.component';
import { TransactionComponent } from './transaction/transaction.component';
import { MetricsComponent } from './metrics/metrics.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { auth2Guard } from './auth2.guard';

export const routes: Routes = [
    {
        path: "features",
        component: FeaturesComponent
    },
    {
        path: "signup",
        component: RegistrationComponent
    },
    {
        path: "",
        component: LandingComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "zone",
        component: ZoneComponent,
        canActivate:[auth2Guard]
    },
    {
        path: "vendor",
        component: VendorComponent,
        canActivate:[auth2Guard]
    },
    {
        path: "stock",
        component: StockComponent,
        canActivate:[auth2Guard]
    },
    {
        path: "transaction",
        component: TransactionComponent,
        canActivate:[auth2Guard]
    },
    {
        path: "metrics",
        component: MetricsComponent,
        canActivate:[auth2Guard,authGuard]
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate:[auth2Guard,authGuard]
    }
];
