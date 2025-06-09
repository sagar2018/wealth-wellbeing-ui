
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import type { Expense } from '@/pages/Index';

interface ExpenseStatsProps {
  expenses: Expense[];
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({ expenses }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const lastMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const thisWeekExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenseDate >= weekAgo;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyChange = lastMonthExpenses === 0 
    ? (thisMonthExpenses > 0 ? 100 : 0)
    : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  const averagePerDay = expenses.length > 0 
    ? totalExpenses / Math.max(1, Math.ceil((Date.now() - new Date(expenses[expenses.length - 1]?.date || new Date()).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{totalExpenses.toFixed(2)}</div>
          <p className="text-blue-100 text-sm mt-1">All time</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{thisMonthExpenses.toFixed(2)}</div>
          <div className="flex items-center gap-1 mt-1">
            {monthlyChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-200" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-200" />
            )}
            <span className="text-green-100 text-sm">
              {Math.abs(monthlyChange).toFixed(1)}% from last month
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{thisWeekExpenses.toFixed(2)}</div>
          <p className="text-purple-100 text-sm mt-1">Last 7 days</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Daily Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{averagePerDay.toFixed(2)}</div>
          <p className="text-orange-100 text-sm mt-1">Per day</p>
        </CardContent>
      </Card>
    </div>
  );
};
