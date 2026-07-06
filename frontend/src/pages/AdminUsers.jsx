import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Navbar from '../components/Navbar';

const ROLES = ['USER', 'LIBRARIAN', 'ADMIN'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setMessage({ type: 'error', text: 'Could not load users.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    setSavingId(id);
    try {
      await api.put(`/users/${id}`, { role });
      loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not update role.' });
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (user) => {
    setSavingId(user.id);
    try {
      await api.put(`/users/${user.id}`, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not update user.' });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not delete this user.' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="font-display text-2xl font-semibold">Manage Users</h1>
        <p className="mb-6 text-sm text-ink/60">Change roles, deactivate accounts, or remove members.</p>

        {message && (
          <div className="mb-6 rounded-md border border-rust/30 bg-rust/5 px-4 py-2.5 text-sm text-rust">
            {message.text}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-ink/50">Loading users…</p>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <Card key={user.id} className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold">{user.name}</h3>
                  <p className="text-sm text-ink/60">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={user.isActive ? 'active' : 'inactive'}>
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </Badge>
                  <select
                    value={user.role}
                    disabled={savingId === user.id}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="rounded-md border border-border bg-paper px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="secondary"
                    isLoading={savingId === user.id}
                    onClick={() => handleToggleActive(user)}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(user.id)}>
                    Delete
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
