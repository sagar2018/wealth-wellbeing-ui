
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseChart } from '@/components/ExpenseChart';
import { ExpenseStats } from '@/components/ExpenseStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, List, Home, LogOut, User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
  user_id: string;
}

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      const savedExpenses = localStorage.getItem(`expenses_${user.id}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'user_id'>) => {
    if (!user) return;
    
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      user_id: user.id,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateExpense = (id: string, updatedExpense: Omit<Expense, 'id' | 'createdAt' | 'user_id'>) => {
    if (!user) return;
    
    setExpenses(prev => prev.map(expense => 
      expense.id === id 
        ? { ...expense, ...updatedExpense }
        : expense
    ));
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Expense Manager</h1>
                {/* <p className="text-sm text-gray-600">Personal Finance Manager</p> */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                {/* <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div> */}
              </div>
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Exp
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ExpenseStats expenses={expenses} />
            <div className="grid md:grid-cols-2 gap-6">
              <ExpenseChart expenses={expenses} />
              <ExpenseList 
                expenses={expenses.slice(0, 5)} 
                onDelete={deleteExpense}
                onUpdate={updateExpense}
                showAll={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="add">
            <ExpenseForm onSubmit={addExpense} />
          </TabsContent>

          <TabsContent value="list">
            <ExpenseList 
              expenses={expenses} 
              onDelete={deleteExpense}
              onUpdate={updateExpense}
              showAll={true}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <ExpenseStats expenses={expenses} />
              <ExpenseChart expenses={expenses} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
