'use client';

import Dashboard from '../components/Dashboard';
import ReceiptUploader from '../components/ReceiptUploader';

export default function DashboardPage() {
  function handleLogout() {
    // Placeholder for logout - currently demo mode has no auth
    console.log('Logout clicked');
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
