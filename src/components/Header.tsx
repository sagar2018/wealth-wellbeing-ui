
import React from 'react';
import { Wallet } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">ExpenseTracker</h1>
              <p className="text-sm text-gray-600">Personal Finance Manager</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Welcome back!</p>
            <p className="text-lg font-semibold text-gray-800">Your Dashboard</p>
          </div>
        </div>
      </div>
    </header>
  );
};
