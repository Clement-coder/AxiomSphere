import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, ShoppingCart, Code, BarChart2, Settings, X, Wallet as WalletIcon } from 'lucide-react';
import { deleteUser, getUser } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from './confirmation-modal'; // Import ConfirmationModal
import { usePrivy } from '@privy-io/react-auth'; // Import usePrivy

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/marketplace', label: 'Marketplace', icon: <ShoppingCart size={20} /> },
  { href: '/execution', label: 'Execution', icon: <Code size={20} /> },
  { href: '/monitoring', label: 'Monitoring', icon: <BarChart2 size={20} /> },
  { href: '/wallet', label: 'Wallet', icon: <WalletIcon size={20} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const { logout } = usePrivy(); // Get Privy's logout function

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogoutClick = () => {
    onClose(); // Close sidebar
    setShowLogoutModal(true); // Open logout confirmation modal
  };

  const onConfirmLogout = async () => {
    setShowLogoutModal(false); // Close modal
    deleteUser(); // Clear local storage user data
    await logout(); // Call Privy's logout function
    window.location.href = '/'; // Redirect to home page
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
            onClick={handleLogoutClick} // Call the new handler
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/20 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={onConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will be redirected to the login page."
        icon={<LogOut className="h-6 w-6 text-destructive" />}
        confirmButtonText="Logout"
        cancelButtonText="Cancel"
      />
    </>
  );
}
