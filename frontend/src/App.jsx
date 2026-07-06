import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import BorrowHistory from './pages/BorrowHistory';
import Profile from './pages/Profile';
import LibrarianBooks from './pages/LibrarianBooks';
import AdminUsers from './pages/AdminUsers';

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/books" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/books" replace /> : <Register />} />

      {/* Any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route path="/books" element={<Books />} />
        <Route path="/borrow/history" element={<BorrowHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Librarian + Admin only */}
      <Route element={<ProtectedRoute roles={['LIBRARIAN', 'ADMIN']} />}>
        <Route path="/librarian/books" element={<LibrarianBooks />} />
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? '/books' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/books' : '/login'} replace />} />
    </Routes>
  );
}
