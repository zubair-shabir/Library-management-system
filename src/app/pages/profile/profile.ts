import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [FormsModule, CommonModule],
})
export class ProfileComponent {
  user: User | null;
  username: string = '';
  password: string = '';
  message: string = '';
  error: string = '';

  constructor(private auth: AuthService) {
    this.user = this.auth.getCurrentUser();
    if (this.user) {
      this.username = this.user.username;
      this.password = this.user.password;
    }
  }

  save() {
    this.error = '';
    this.message = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Username and password cannot be empty.';
      return;
    }
  
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (
      users.some(
        (u: any) =>
          u.username.toLowerCase() === this.username.trim().toLowerCase() &&
          u.id !== this.user?.id
      )
    ) {
      this.error = 'Username already taken.';
      return;
    }
    if (this.user) {
      this.user.username = this.username.trim();
      this.user.password = this.password;
      this.auth.updateUser(this.user);
      this.message = 'Profile updated successfully!';
    }
  }
}
