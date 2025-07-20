import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
  borrowedBooks: number[];
  borrowLimit?: number;
}

export interface Transaction {
  userId: number;
  username: string;
  bookId: number;
  bookTitle: string;
  action: 'borrow' | 'return';
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  register(user: User): boolean {
    const users = this.getAllUsers();
    const exists = users.find((u) => u.username === user.username);
    if (exists) return false;

    user.id = Date.now();
    user.borrowedBooks = [];
    if (user.borrowLimit === undefined) user.borrowLimit = 3;
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getAllUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  getAllUsers(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  updateUser(updatedUser: User) {
    const users = this.getAllUsers().map((u) =>
      u.id === updatedUser.id
        ? { ...updatedUser, borrowLimit: updatedUser.borrowLimit ?? 3 }
        : u
    );
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  addTransaction(transaction: Transaction) {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  getTransactions(): Transaction[] {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }
  get isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  get isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}
