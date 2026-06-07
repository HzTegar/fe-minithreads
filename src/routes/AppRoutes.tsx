import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ThreadDetailPage } from '../pages/ThreadDetailPage';
import { CreateThreadPage } from '../pages/CreateThreadPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SearchPage } from '../pages/SearchPage';

import { NotificationsPage } from '../pages/NotificationsPage';
import { BookmarksPage } from '../pages/BookmarksPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/thread/:id" element={<ThreadDetailPage />} />
        <Route path="/edit-thread/:id" element={<ThreadDetailPage />} /> {/* Reusing detail or specific edit page if exists */}
      </Routes>
    </BrowserRouter>
  );
};
