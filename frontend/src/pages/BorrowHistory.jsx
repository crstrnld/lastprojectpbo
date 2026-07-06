import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const STATUS_TONE = { BORROWED: 'borrowed', RETURNED: 'returned', OVERDUE: 'overdue' };

export default function BorrowHistory() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/borrow/history');
      setRecords(data);
    } catch (err) {
      setError('Could not load your borrow history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleReturn = async (id) => {
    setReturningId(id);
    try {
      await api.put(`/borrow/${id}/return`);
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not return this book.');
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="font-display text-2xl font-semibold">My Loans</h1>
        <p className="mb-6 text-sm text-ink/60">Everything you've borrowed, past and present.</p>

        {error && (
          <div className="mb-6 rounded-md border border-rust/30 bg-rust/5 px-4 py-2.5 text-sm text-rust">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-ink/50">Loading your history…</p>
        ) : records.length === 0 ? (
          <Card className="text-center text-sm text-ink/50">You haven't borrowed any books yet.</Card>
        ) : (
          <div className="flex flex-col gap-3">
            {records.map((record) => (
              <Card key={record.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold">{record.book.title}</h3>
                  <p className="text-sm text-ink/60">{record.book.author}</p>
                  <p className="mt-1 font-mono text-xs text-ink/50">
                    Borrowed {record.borrowDate} · Due {record.dueDate}
                    {record.returnDate ? ` · Returned ${record.returnDate}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={STATUS_TONE[record.status]}>{record.status}</Badge>
                  {record.status !== 'RETURNED' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      isLoading={returningId === record.id}
                      onClick={() => handleReturn(record.id)}
                    >
                      Return
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
