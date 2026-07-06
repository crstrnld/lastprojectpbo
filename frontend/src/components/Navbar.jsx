import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from './Button';

const linkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive ? 'text-forest bg-forest/10' : 'text-ink/70 hover:text-ink hover:bg-ink/5'
  }`;

export default function Navbar() {
  const { user, logout, hasRole } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <span className="font-display text-xl font-semibold text-forest">Athenaeum</span>
          <nav className="hidden gap-1 sm:flex">
            <NavLink to="/books" className={linkClass}>Catalog</NavLink>
            <NavLink to="/borrow/history" className={linkClass}>My Loans</NavLink>
            {hasRole('librarian', 'admin') && (
              <NavLink to="/librarian/books" className={linkClass}>Manage Books</NavLink>
            )}
            {hasRole('admin') && (
              <NavLink to="/admin/users" className={linkClass}>Manage Users</NavLink>
            )}
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink/60 sm:inline">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>Log out</Button>
        </div>
      </div>
    </header>
  );
}
