import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  username = '';
  password = '';
  role: 'admin' | 'user' = 'user';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    const success = this.auth.register({
      id: 0,
      username: this.username,
      password: this.password,
      role: this.role,
      borrowedBooks: [],
    });

    if (success) {
      this.router.navigate(['/login']);
    } else {
      this.error = 'User already exists.';
    }
  }
}
