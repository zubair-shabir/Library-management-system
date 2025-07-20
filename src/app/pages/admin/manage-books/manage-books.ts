import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  borrowLimit: number;
}

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.html',
  imports: [FormsModule, CommonModule],
})
export class ManageBooksComponent {
  books: Book[] = [];
  title: string = '';
  newBorrowLimit: number | null = null;

  editBookId: number | null = null;
  editTitle: string = '';
  editBorrowLimit: number | null = null;

  errorMessage: string = '';
  editErrorMessage: string = '';

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    const stored = localStorage.getItem('books');
    this.books = stored ? JSON.parse(stored) : [];
  }

  saveBooks() {
    localStorage.setItem('books', JSON.stringify(this.books));
  }

  addBook() {
    this.errorMessage = '';

    if (
      !this.title.trim() ||
      this.newBorrowLimit === null ||
      this.newBorrowLimit < 1
    ) {
      this.errorMessage =
        'All fields are required and borrow limit must be at least 1.';
      return;
    }
    if (
      this.books.some(
        (book) =>
          book.title.trim().toLowerCase() === this.title.trim().toLowerCase()
      )
    ) {
      this.errorMessage = 'A book with this title already exists.';
      return;
    }
    const newBook: Book = {
      id: Date.now(),
      title: this.title.trim(),
      borrowLimit: this.newBorrowLimit,
    };
    this.books.push(newBook);
    this.saveBooks();
    this.title = '';
    this.newBorrowLimit = null;
  }

  deleteBook(id: number) {
    this.books = this.books.filter((book) => book.id !== id);
    this.saveBooks();
  }

  startEdit(book: Book) {
    this.editBookId = book.id;
    this.editTitle = book.title;
    this.editBorrowLimit = book.borrowLimit;
    this.editErrorMessage = '';
  }

  saveEdit() {
    this.editErrorMessage = '';
    if (
      this.editBookId === null ||
      !this.editTitle.trim() ||
      this.editBorrowLimit === null ||
      this.editBorrowLimit < 1
    ) {
      this.editErrorMessage =
        'All fields are required and borrow limit must be at least 1.';
      return;
    }
    if (
      this.books.some(
        (book) =>
          book.title.trim().toLowerCase() ===
            this.editTitle.trim().toLowerCase() && book.id !== this.editBookId
      )
    ) {
      this.editErrorMessage = 'A book with this title already exists.';
      return;
    }
    const idx = this.books.findIndex((b) => b.id === this.editBookId);
    if (idx !== -1) {
      this.books[idx].title = this.editTitle.trim();
      this.books[idx].borrowLimit = this.editBorrowLimit;
      this.saveBooks();
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editBookId = null;
    this.editTitle = '';
    this.editBorrowLimit = null;
    this.editErrorMessage = '';
  }
}
