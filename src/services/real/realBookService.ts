import { AxiosInstance } from 'axios';
import { IBookService } from '../interfaces/bookService';
import { Book, Difficulty, PaginatedResponse } from '../../types';

export class RealBookService implements IBookService {
  constructor(private client: AxiosInstance) {}

  async getBooks(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    difficulty?: Difficulty;
    includeExternal?: boolean;
  }): Promise<PaginatedResponse<Book>> {
    const { data } = await this.client.get('/books', { params });
    return data;
  }

  async getBookById(bookId: string): Promise<Book> {
    const { data } = await this.client.get(`/books/${bookId}`);
    return data;
  }

  async importBook(externalId: string): Promise<Book> {
    const { data } = await this.client.post('/books/import', { externalId });
    return data;
  }

  async getDailyBook(): Promise<Book> {
    const { data } = await this.client.get('/books/daily');
    return data;
  }
}
