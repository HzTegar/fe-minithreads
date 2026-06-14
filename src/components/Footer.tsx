import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export const Footer: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <footer className="border-t border-border bg-background mt-12">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="inline-block">
              <img
                src={isDark ? "/logo-minithreads.png" : "/logo-minithreads-light.png"}
                alt="MiniThreads"
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A community-driven Q&A platform for developers. Ask questions, share knowledge, and grow together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-thread" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Ask a Question
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/notifications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Anggota Kelompok</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tito Tegar Pratama | 32
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Najwa Faradissa | 18
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Syifa Rismawati | 31
                </a>
              </li>
               <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Ridho Sabirin | 26
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MiniThreads. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with React and Laravel
          </p>
        </div>
      </div>
    </footer>
  );
};
