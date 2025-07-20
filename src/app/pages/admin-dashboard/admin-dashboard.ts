import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  imports:[RouterModule]
})
export class AdminDashboardComponent {
  user: User | null;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getCurrentUser();
  }
}
