import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/(main)/view/HomePageView";
import { LoginPage } from "../pages/(main)/view/LoginPageView";
import { RegisterPage } from "../pages/(main)/view/RegisterPageView";
import { ThreadDetailPage } from "../pages/(main)/view/ThreadDetailPageView";
import { CreateThreadPage } from "../pages/(main)/view/CreateThreadPageView";
import { ProfilePage } from "../pages/(main)/view/ProfilePageView";
import { UserProfilePage } from "../pages/(main)/view/UserProfilePageView";
import { SearchPage } from "../pages/(main)/view/SearchPageView";
import { NotificationsPage } from "../pages/(main)/view/NotificationsPageView";
import { BookmarksPage } from "../pages/(main)/view/BookmarksPageView";
import AdminReportsPageView from "../pages/(main)/view/AdminReportsPageView";
import AdminReportDetailPageView from "../pages/(main)/view/AdminReportDetailPageView";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:username" element={<UserProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/thread/:id" element={<ThreadDetailPage />} />
        <Route path="/edit-thread/:id" element={<ThreadDetailPage />} />
        <Route path="/admin/reports" element={<AdminReportsPageView />} />
        <Route
          path="/admin/reports/:id"
          element={<AdminReportDetailPageView />}
        />
      </Routes>
    </BrowserRouter>
  );
};
