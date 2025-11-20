'use client';
import './globals.css';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/storage';
import Sidebar from '@/components/sidebar';
import SkeletonLoader from '@/components/skeleton-loader';
import Navbar from '@/components/navbar';
import { usePathname, useRouter } from 'next/navigation';
import SearchModal from '@/components/search-modal';
import NotificationPanel from '@/components/notification-panel';
import { AppProviders } from '@/components/AppProviders';

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      // Simulate a delay for a better loading experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      const storedUser = getUser();
      setUser(storedUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/') {
      router.push('/');
    }
  }, [loading, user, pathname, router]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchModalToggle = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
  };

  const handleNotificationPanelToggle = () => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  if (loading) {
    return (
      <html lang="en">
        <body>
          <AppProviders>
            <div className="flex min-h-screen bg-background text-foreground">
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              <div className="flex-1 flex flex-col md:ml-64">
                <Navbar
                  onMenuClick={handleSidebarToggle}
                  onSearchClick={handleSearchModalToggle}
                  onNotificationClick={handleNotificationPanelToggle}
                />
                <main className="flex-1 p-8">
                  <SkeletonLoader />
                </main>
              </div>
              <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
              <NotificationPanel isOpen={isNotificationPanelOpen} onClose={() => setIsNotificationPanelOpen(false)} />
            </div>
          </AppProviders>
        </body>
      </html>
    );
  }

  if (!user && pathname !== '/') {
    return (
      <html lang="en">
        <body>
          <AppProviders>
            <div className="flex min-h-screen bg-background text-foreground">
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              <div className="flex-1 flex flex-col md:ml-64">
                <Navbar
                  onMenuClick={handleSidebarToggle}
                  onSearchClick={handleSearchModalToggle}
                  onNotificationClick={handleNotificationPanelToggle}
                />
                <main className="flex-1 p-8">
                  <SkeletonLoader />
                </main>
              </div>
              <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
              <NotificationPanel isOpen={isNotificationPanelOpen} onClose={() => setIsNotificationPanelOpen(false)} />
            </div>
          </AppProviders>
        </body>
      </html>
    );
  }

  if (!user && pathname === '/') {
    return (
      <html lang="en">
        <body>
          <AppProviders>
            {children}
          </AppProviders>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col md:ml-64">
              <Navbar
                onMenuClick={handleSidebarToggle}
                onSearchClick={handleSearchModalToggle}
                onNotificationClick={handleNotificationPanelToggle}
              />
              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
            <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
            <NotificationPanel isOpen={isNotificationPanelOpen} onClose={() => setIsNotificationPanelOpen(false)} />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
