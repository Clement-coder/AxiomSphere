'use client';
import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import { getUser, deleteUser } from '@/lib/storage';
import { ConfirmationModal } from './confirmation-modal'; // Import ConfirmationModal
import { usePrivy } from '@privy-io/react-auth'; // Import usePrivy

interface NavbarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onNotificationClick: () => void;
}

export default function Navbar({ onMenuClick, onSearchClick, onNotificationClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const { logout } = usePrivy(); // Get Privy's logout function

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogoutClick = () => {
    setShowUserMenu(false); // Close user menu
    setShowLogoutModal(true); // Open logout confirmation modal
  };

  const onConfirmLogout = async () => {
    setShowLogoutModal(false); // Close modal
    deleteUser(); // Clear local storage user data
    await logout(); // Call Privy's logout function
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <button onClick={onMenuClick} className="md:hidden p-2 rounded-full hover:bg-muted">
        <Menu size={20} />
      </button>

      <div className="relative flex-1 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-muted pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-1 justify-end items-center gap-4">
        {/* Search for mobile */}
        <button onClick={onSearchClick} className="md:hidden p-2 rounded-full hover:bg-muted">
          <Search size={20} />
        </button>

        <div className="relative">
          <button
            onClick={onNotificationClick}
            className="relative rounded-full p-2 hover:bg-muted"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-muted"
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="hidden md:block text-sm font-medium">{user?.email}</span>
            <ChevronDown className="h-5 w-5 text-muted-foreground hidden md:block" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-background shadow-lg">
              <div className="py-1">
                <button
                  onClick={handleLogoutClick} // Call the new handler
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </header>
  );
}
