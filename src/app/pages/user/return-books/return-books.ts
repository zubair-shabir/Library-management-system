import { Component } from '@angular/core';
import { AuthService, User } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-return-books',
  templateUrl: './return-books.html',
  imports: [CommonModule],
})
export class ReturnBooksComponent {
  user: User | null;
  books: any[] = [];
  message = '';

  constructor(private auth: AuthService) {
    this.user = this.auth.getCurrentUser();
    this.books = this.getBooks();
  }

  getBooks() {
    return JSON.parse(localStorage.getItem('books') || '[]');
  }

  getBorrowedBooks() {
    return this.books.filter((book) =>
      this.user?.borrowedBooks.includes(book.id)
    );
  }

  returnBook(bookId: number) {
    if (!this.user) return;

    const books = this.getBooks();
    const book = books.find((b: any) => b.id === bookId);
    if (book) {
      book.available = true;
      book.borrowLimit += 1;
      this.auth.addTransaction({
        userId: this.user.id,
        username: this.user.username,
        bookId: book.id,
        bookTitle: book.title,
        action: 'return',
        timestamp: Date.now(),
      });
    }

    this.user.borrowedBooks = this.user.borrowedBooks.filter(
      (id) => id !== bookId
    );
    this.auth.updateUser(this.user);

    localStorage.setItem('books', JSON.stringify(books));
    this.books = books;
    this.message = 'Book returned successfully!';
  }
}
