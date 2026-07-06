import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Badge from '../components/Badge';
import Navbar from '../components/Navbar';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [borrowingId, setBorrowingId] = useState(null);

  const loadBooks = async (q = '') => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/books', { params: q ? { q } : {} });
      setBooks(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not load the catalog.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadBooks(query);
  };

  const handleBorrow = async (bookId) => {
    setBorrowingId(bookId);
    setMessage(null);
    try {
      await api.post('/borrow', { bookId });
      setMessage({ type: 'success', text: 'Book borrowed — check My Loans for the due date.' });
      loadBooks(query);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not borrow this book.' });
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Catalog</h1>
            <p className="text-sm text-ink/60">Browse what's on the shelves and borrow what you need.</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search by title or author"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-md border px-4 py-2.5 text-sm ${
              message.type === 'success'
                ? 'border-forest/30 bg-forest/5 text-forest'
                : 'border-rust/30 bg-rust/5 text-rust'
            }`}
          >
            {message.text}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-ink/50">Loading the shelves…</p>
        ) : books.length === 0 ? (
          <Card className="text-center text-sm text-ink/50">No books match your search.</Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id} stub className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight">{book.title}</h3>
                    <p className="text-sm text-ink/60">{book.author}</p>
                  </div>
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={`Cover of ${book.title}`}
                      className="h-16 w-12 rounded object-cover shadow-sm"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Badge tone={book.availableCopies > 0 ? 'active' : 'inactive'}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of copies'}
                  </Badge>
                  <Button
                    size="sm"
                    disabled={book.availableCopies <= 0}
                    isLoading={borrowingId === book.id}
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
