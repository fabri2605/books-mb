import { IBookService } from '../interfaces/bookService';
import { Book, Difficulty, PaginatedResponse } from '../../types';
import { mockBooks } from './mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockBookService implements IBookService {
  async getBooks(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    difficulty?: Difficulty;
  }): Promise<PaginatedResponse<Book>> {
    await delay(350);
    const { page = 1, pageSize = 20, search, difficulty } = params;

    let filtered = [...mockBooks];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
      );
    }

    if (difficulty) {
      filtered = filtered.filter((b) => b.difficulty === difficulty);
    }

    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total: filtered.length, page, pageSize };
  }

  async getBookById(bookId: string): Promise<Book> {
    await delay(300);
    const book = mockBooks.find((b) => b.id === bookId);
    if (!book) throw new Error(`Book ${bookId} not found`);
    return book;
  }

  async importBook(_externalId: string): Promise<Book> {
    throw new Error('Not implemented in mock');
  }

  async getDailyBook(): Promise<Book> {
    return mockBooks[0];
  }
}
