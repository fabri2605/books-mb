import { useState, useEffect, useCallback } from 'react';
import { Book, Difficulty } from '../types';
import { bookService } from '../services';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [includeExternal, setIncludeExternal] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await bookService.getBooks({
        search: search || undefined,
        difficulty: difficulty ?? undefined,
        includeExternal: includeExternal || undefined,
      });
      setBooks(result.data);
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, includeExternal]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    includeExternal,
    setIncludeExternal,
    refetch: fetchBooks,
  };
}
