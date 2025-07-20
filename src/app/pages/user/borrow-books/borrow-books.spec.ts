import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowBooks } from './borrow-books';

describe('BorrowBooks', () => {
  let component: BorrowBooks;
  let fixture: ComponentFixture<BorrowBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowBooks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
