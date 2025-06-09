
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Calendar, Eye } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import type { Expense } from '@/pages/Index';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, expense: Omit<Expense, 'id' | 'createdAt' | 'user_id'>) => void;
  showAll: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onDelete, 
  onUpdate, 
  showAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Bills & Utilities': 'bg-red-100 text-red-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Travel': 'bg-cyan-100 text-cyan-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Personal Care': 'bg-rose-100 text-rose-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-6 h-6" />
          {showAll ? 'All Expenses' : 'Recent Expenses'}
        </CardTitle>
        <CardDescription className="text-green-100">
          {showAll ? 'View and manage all your expenses in ₹' : 'Your latest expense records in ₹'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {showAll && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <IndianRupee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first expense'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{expense.description}</h3>
                    <span className="text-xl font-bold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(expense.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {showAll && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    className="ml-4"
                    disabled={deletingId === expense.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
