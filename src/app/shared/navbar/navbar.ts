import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [CommonModule,RouterModule]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {
    console.log(auth)
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
