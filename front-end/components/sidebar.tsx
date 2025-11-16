'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, ShoppingCart, Code, BarChart2, Settings, X } from 'lucide-react';
import { deleteUser, getUser } from '@/lib/storage';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/marketplace', label: 'Marketplace', icon: <ShoppingCart size={20} /> },
  { href: '/execution', label: 'Execution', icon: <Code size={20} /> },
  { href: '/monitoring', label: 'Monitoring', icon: <BarChart2 size={20} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    deleteUser();
    window.location.href = '/';
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r border-border/50 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64`}
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>⚡</span>
            <span>DApp</span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted md:hidden">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'hover:bg-primary/10'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground truncate mb-2">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/20 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
