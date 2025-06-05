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
        component: ZoneComponent
    },
    {
        path: "vendor",
        component: VendorComponent
    },
    {
        path: "stock",
        component: StockComponent
    },
    {
        path: "transaction",
        component: TransactionComponent
    },
    {
        path: "metrics",
        component: MetricsComponent,
        canActivate:[authGuard]
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate:[authGuard]
    }
];
