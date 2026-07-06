import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useAuthStore } from '../store/authStore';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const { data } = await api.put('/profile', payload);
      updateUser(data);
      setForm({ ...form, currentPassword: '', newPassword: '' });
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not update profile.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-lg px-6 py-8">
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <div className="mb-6 mt-2 flex items-center gap-2">
          <span className="text-sm text-ink/60">Role</span>
          <Badge tone={user?.role?.toLowerCase()}>{user?.role}</Badge>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {message && (
              <div
                className={`rounded-md border px-3 py-2 text-sm ${
                  message.type === 'success'
                    ? 'border-forest/30 bg-forest/5 text-forest'
                    : 'border-rust/30 bg-rust/5 text-rust'
                }`}
              >
                {message.text}
              </div>
            )}
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} />

            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-medium text-ink/70">Change password (optional)</p>
              <div className="flex flex-col gap-3">
                <Input
                  label="Current password"
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Required to set a new password"
                />
                <Input
                  label="New password"
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
              Save changes
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
