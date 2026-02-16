import { useState, useEffect, useCallback } from 'react';
import { Book, Difficulty } from '../types';
import { bookService } from '../services';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await bookService.getBooks({
        search: search || undefined,
        difficulty: difficulty ?? undefined,
      });
      setBooks(result.data);
    } finally {
      setLoading(false);
    }
  }, [search, difficulty]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, search, setSearch, difficulty, setDifficulty, refetch: fetchBooks };
}
