import { Component } from '@angular/core';
import { AuthService, User } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.html',
  imports: [CommonModule, FormsModule],
})
export class ViewUsersComponent {
  users: User[] = [];
  books: any[] = [];

  // Editing state
  editUserId: number | null = null;
  editUsername: string = '';
  editPassword: string = '';
  editBorrowLimit: number = 3;
  editError: string = '';
  editMessage: string = '';

  transactionsByUser: { [userId: number]: any[] } = {};
  expandedUserId: number | null = null;

  constructor(private auth: AuthService) {
    this.users = this.auth.getAllUsers().filter((u) => u.role === 'user');
    this.books = JSON.parse(localStorage.getItem('books') || '[]');
  }

  getBookTitleById(id: number): string {
    const book = this.books.find((b: any) => b.id === id);
    return book ? book.title : 'Unknown Book';
  }

  startEdit(user: User) {
    this.editUserId = user.id;
    this.editUsername = user.username;
    this.editPassword = user.password;
    this.editBorrowLimit = user.borrowLimit ?? 3;
    this.editError = '';
    this.editMessage = '';
  }

  saveEdit() {
    this.editError = '';
    this.editMessage = '';
    if (!this.editUsername.trim() || !this.editPassword.trim()) {
      this.editError = 'Username and password cannot be empty.';
      return;
    }
    if (this.editBorrowLimit < 1) {
      this.editError = 'Borrow limit must be at least 1.';
      return;
    }
    // Check for username conflict
    if (
      this.users.some(
        (u) =>
          u.username.toLowerCase() === this.editUsername.trim().toLowerCase() &&
          u.id !== this.editUserId
      )
    ) {
      this.editError = 'Username already taken.';
      return;
    }
    const idx = this.users.findIndex((u) => u.id === this.editUserId);
    if (idx !== -1) {
      const updatedUser = {
        ...this.users[idx],
        username: this.editUsername.trim(),
        password: this.editPassword,
        borrowLimit: this.editBorrowLimit,
      };
      this.auth.updateUser(updatedUser);
      this.users[idx] = updatedUser;
      this.editMessage = 'User updated successfully!';
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editUserId = null;
    this.editUsername = '';
    this.editPassword = '';
    this.editBorrowLimit = 3;
    this.editError = '';
    this.editMessage = '';
  }

  getTransactionsForUser(userId: number) {
    if (!this.transactionsByUser[userId]) {
      const allTransactions = this.auth.getTransactions();
      this.transactionsByUser[userId] = allTransactions.filter(t => t.userId === userId);
    }
    return this.transactionsByUser[userId];
  }

  toggleTransactions(userId: number) {
    if (this.expandedUserId === userId) {
      this.expandedUserId = null;
    } else {
      this.expandedUserId = userId;
    }
  }
}
