import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Navbar from '../components/Navbar';

const EMPTY_FORM = { title: '', author: '', coverImage: '', availableCopies: 1 };

export default function LibrarianBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch {
      setMessage({ type: 'error', text: 'Could not load books.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'availableCopies' ? Number(value) : value });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, form);
        setMessage({ type: 'success', text: 'Book updated.' });
      } else {
        await api.post('/books', form);
        setMessage({ type: 'success', text: 'Book added to the catalog.' });
      }
      resetForm();
      loadBooks();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not save this book.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      coverImage: book.coverImage || '',
      availableCopies: book.availableCopies,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this book from the catalog?')) return;
    try {
      await api.delete(`/books/${id}`);
      loadBooks();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not delete this book.' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="font-display text-2xl font-semibold">Manage Books</h1>
        <p className="mb-6 text-sm text-ink/60">Add new titles and keep copy counts accurate.</p>

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <h2 className="mb-4 font-display text-lg font-semibold">
              {editingId ? 'Edit book' : 'Add a book'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
              <Input label="Author" name="author" value={form.author} onChange={handleChange} required />
              <Input
                label="Cover image URL"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://…"
              />
              <Input
                label="Available copies"
                type="number"
                min={0}
                name="availableCopies"
                value={form.availableCopies}
                onChange={handleChange}
                required
              />
              <div className="mt-2 flex gap-2">
                <Button type="submit" isLoading={isSaving} className="flex-1">
                  {editingId ? 'Save changes' : 'Add book'}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          <div className="lg:col-span-2">
            {isLoading ? (
              <p className="text-sm text-ink/50">Loading books…</p>
            ) : (
              <div className="flex flex-col gap-3">
                {books.map((book) => (
                  <Card key={book.id} className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold">{book.title}</h3>
                      <p className="text-sm text-ink/60">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={book.availableCopies > 0 ? 'active' : 'inactive'}>
                        {book.availableCopies} copies
                      </Badge>
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(book)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(book.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
