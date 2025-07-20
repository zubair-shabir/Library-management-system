import { Component } from '@angular/core';
import { AuthService, User } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-borrow-books',
  templateUrl: './borrow-books.html',
  imports: [CommonModule],
})
export class BorrowBooksComponent {
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

  hasUserBorrowedBook(bookId: number): boolean {
    if (!this.user) return false;
    return this.user.borrowedBooks.includes(bookId);
  }

  borrow(bookId: number) {
    this.message = '';
    if (!this.user) return;

    if (this.books.length === 0) {
      this.message = 'No books are available in the library.';
      return;
    }

    if (
      this.books.every((book) => this.user!.borrowedBooks.includes(book.id))
    ) {
      this.message = 'You have already borrowed all available books.';
      return;
    }

    const userBorrowLimit = this.user.borrowLimit ?? 3;
    if (this.user.borrowedBooks.length >= userBorrowLimit) {
      this.message = `You can only borrow up to ${userBorrowLimit} books at a time.`;
      return;
    }

    const books = this.getBooks();
    const book = books.find((b: any) => b.id === bookId);

    if (!book) {
      this.message = 'Book not found.';
      return;
    }

    if (book.borrowLimit === 0) {
      this.message = `This book cannot be borrowed (limit is 0).`;
      return;
    }

    if (this.hasUserBorrowedBook(bookId)) {
      this.message = `You have already borrowed "${book.title}".`;
      return;
    }

    this.user.borrowedBooks.push(bookId);
    book.borrowLimit -= 1;
    this.auth.updateUser(this.user);
    localStorage.setItem('books', JSON.stringify(books));

    this.auth.addTransaction({
      userId: this.user.id,
      username: this.user.username,
      bookId: book.id,
      bookTitle: book.title,
      action: 'borrow',
      timestamp: Date.now(),
    });

    this.message = `You borrowed "${book.title}" successfully!`;
    this.books = books;
  }
}
