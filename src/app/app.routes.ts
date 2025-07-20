import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard';
import { ManageBooksComponent } from './pages/admin/manage-books/manage-books';
import { ViewUsersComponent } from './pages/admin/view-users/view-users';
import { BorrowBooksComponent } from './pages/user/borrow-books/borrow-books';
import { ReturnBooksComponent } from './pages/user/return-books/return-books';

import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';
import { UserGuard } from './guards/user-guard';
import { ProfileComponent } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

 
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/manage-books',
    component: ManageBooksComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/view-users',
    component: ViewUsersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'user/borrow-books',
    component: BorrowBooksComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'user/return-books',
    component: ReturnBooksComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },


  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
