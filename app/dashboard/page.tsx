'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../components/Dashboard';
import ReceiptUploader from '../components/ReceiptUploader';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if auth token exists
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='));

    if (!token) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  function handleLogout() {
    // Clear cookie
    document.cookie = 'auth_token=; max-age=0; path=/';
    router.push('/');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {/* Top Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🏦 Budget Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <ReceiptUploader />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
