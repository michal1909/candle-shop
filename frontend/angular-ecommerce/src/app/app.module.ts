import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminGuard } from './admin.guard';
import { AdminProductManagementComponent } from './components/admin-product-management/admin-product-management.component';
import { HistoryComponent } from './history/history.component';


const routes: Routes = [
  {path: 'admin/products', component: AdminProductManagementComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard]},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'categories/:id', component: ProductListComponent},
  {path: 'categories', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'history', component: HistoryComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    NavbarComponent,
    ProductDetailsComponent,
    CartDetailsComponent,
    LoginComponent,
    RegisterComponent,
    CheckoutComponent,
    FooterComponent,
    AdminPanelComponent,
    AdminProductManagementComponent,
    HistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgbModule
  ],
  providers: [ProductService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
