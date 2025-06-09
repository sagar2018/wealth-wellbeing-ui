
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Expense } from '@/pages/Index';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "Failed to load expenses",
          variant: "destructive"
        });
        return;
      }

      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add expense to Supabase
  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          amount: expense.amount,
          description: expense.description,
          category: expense.category,
          date: expense.date,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        toast({
          title: "Error",
          description: "Failed to add expense",
          variant: "destructive"
        });
        return;
      }

      // Convert the database response to match our Expense interface
      const newExpense: Expense = {
        id: data.id,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        createdAt: data.created_at,
        user_id: data.user_id
      };

      setExpenses(prev => [newExpense, ...prev]);
      toast({
        title: "Success",
        description: "Expense added successfully"
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive"
      });
    }
  };

  // Delete expense from Supabase
  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        toast({
          title: "Error",
          description: "Failed to delete expense",
          variant: "destructive"
        });
        return;
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast({
        title: "Success",
        description: "Expense deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
  };

  // Update expense in Supabase
  const updateExpense = async (id: string, updatedExpense: Omit<Expense, 'id' | 'createdAt' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: updatedExpense.amount,
          description: updatedExpense.description,
          category: updatedExpense.category,
          date: updatedExpense.date
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating expense:', error);
        toast({
          title: "Error",
          description: "Failed to update expense",
          variant: "destructive"
        });
        return;
      }

      // Convert the database response to match our Expense interface
      const updated: Expense = {
        id: data.id,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: data.date,
        createdAt: data.created_at,
        user_id: data.user_id
      };

      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updated : expense
      ));
      toast({
        title: "Success",
        description: "Expense updated successfully"
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    refetch: fetchExpenses
  };
};
