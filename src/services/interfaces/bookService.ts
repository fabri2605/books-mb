import { Book, Difficulty, PaginatedResponse } from '../../types';

export interface IBookService {
  getBooks(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    difficulty?: Difficulty;
    includeExternal?: boolean;
  }): Promise<PaginatedResponse<Book>>;
  getBookById(bookId: string): Promise<Book>;
  importBook(externalId: string): Promise<Book>;
}
