import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuthStore } from '../store/authStore';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setSession(data);
      navigate('/books', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-forest">Athenaeum</h1>
          <p className="mt-1 text-sm text-ink/60">Create your library membership</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-md border border-rust/30 bg-rust/5 px-3 py-2 text-sm text-rust">
                {error}
              </div>
            )}
            <Input
              label="Full name"
              name="name"
              placeholder="Ada Lovelace"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
            <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
              Create account
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-ink/60">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-forest hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
