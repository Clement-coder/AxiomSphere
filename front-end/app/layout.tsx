'use client';
import './globals.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUser, deleteUser } from '@/lib/storage';
import { LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    deleteUser();
    setUser(null);
    window.location.href = '/';
  };

  if (!user) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/execution', label: 'Execution' },
    { href: '/monitoring', label: 'Monitoring' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background text-foreground">
          {/* Navigation */}
          <nav className="glass border-b border-border/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
                <span>⚡</span>
                <span>DApp</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-primary transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="relative">
                  <button
                    onClick={() => setShowLogout(!showLogout)}
                    className="icon-button flex items-center gap-2 px-2"
                  >
                    <span>👤</span>
                  </button>
                  {showLogout && (
                    <div className="absolute right-0 mt-2 w-48 glass border border-border/50 rounded-lg p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="text-xs text-muted-foreground px-3 py-2 border-b border-border/50 truncate">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/20 rounded text-destructive transition-colors flex items-center gap-2 font-medium"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden icon-button"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-border/50 p-4 space-y-2 animate-in fade-in slide-in-from-top duration-200">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded hover:bg-primary/20 transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm rounded text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-2 font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
