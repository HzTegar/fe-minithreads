import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authStore } from "../store/authStore";
import { ThemeToggle } from "./ThemeToggle";
import { resolveAvatarUrl } from "../utils/constants";
import { useTheme } from "../hooks/useTheme";

export const Navbar: React.FC = () => {
  const [authState, setAuthState] = useState(authStore.getState());
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  useEffect(() => {
    return authStore.subscribe((state) => setAuthState(state));
  }, []);

  const handleLogout = () => {
    authStore.clearAuth();
    navigate("/login");
  };

  const isAdminOrMod =
    authState.user?.level === "admin" || authState.user?.level === "moderator";

  const avatarUrl = authState.user
    ? resolveAvatarUrl(authState.user.avatar_url || authState.user.avatarUrl)
    : null;

  const linkCls =
    "text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-full transition-all duration-150";
  const mobileLinkCls =
    "block text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2.5 rounded-xl transition-all duration-150";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between h-14 px-6">

          {/* ── Logo ── */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img
              src={isDark ? "/logo-minithreads.png" : "/logo-minithreads-light.png"}
              alt="MiniThreads"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/" className={linkCls}>Home</Link>

            {authState.isAuthenticated ? (
              <>
                <div className="w-px h-4 bg-border mx-1" />

                {isAdminOrMod && (
                  <Link
                    to="/admin/reports"
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 px-3 py-1.5 rounded-full transition-all duration-150"
                  >
                    Reports
                  </Link>
                )}

                <Link to="/notifications" className={linkCls}>Notifications</Link>

                {/* Profile avatar + username */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-full transition-all duration-150"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={authState.user?.username ?? "avatar"}
                      className="w-7 h-7 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-[11px] font-semibold text-muted-foreground uppercase">
                      {authState.user?.username?.[0] ?? "U"}
                    </div>
                  )}
                  <span>{authState.user?.username}</span>
                </Link>

                <span
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className={linkCls}>Login</Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 px-3 py-1.5 rounded-full transition-all duration-150"
                >
                  Register
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Hamburger */}
          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-[5px] items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-[1.5px] bg-current rounded-full transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-current rounded-full transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-current rounded-full transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-border px-4 pb-4 pt-2 flex flex-col gap-1 bg-background">
            <Link to="/" className={mobileLinkCls} onClick={() => setMenuOpen(false)}>Home</Link>

            {authState.isAuthenticated ? (
              <>
                {isAdminOrMod && (
                  <Link
                    to="/admin/reports"
                    className="block text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 px-4 py-2.5 rounded-xl transition-all duration-150"
                    onClick={() => setMenuOpen(false)}
                  >
                    Reports
                  </Link>
                )}
                <Link to="/notifications" className={mobileLinkCls} onClick={() => setMenuOpen(false)}>Notifications</Link>
                <Link to="/profile" className={mobileLinkCls} onClick={() => setMenuOpen(false)}>
                  Profile ({authState.user?.username})
                </Link>
                <span
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="block text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer"
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className={mobileLinkCls} onClick={() => setMenuOpen(false)}>Login</Link>
                <Link
                  to="/register"
                  className="block text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 px-4 py-2.5 rounded-xl transition-all duration-150"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
};