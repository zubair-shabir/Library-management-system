import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.html',
  imports: [RouterModule],
})
export class UserDashboardComponent {
  user: User | null;

  constructor(private auth: AuthService) {
    this.user = this.auth.getCurrentUser();
  }

}
