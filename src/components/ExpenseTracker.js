import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Updated Select component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, Edit2, Save } from 'lucide-react';

const ExpenseTracker = () => {
  // State management
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'food',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [totalByCategory, setTotalByCategory] = useState({});

  // Categories and their colors for the pie chart
  const categories = ['food', 'transport', 'utilities', 'entertainment', 'other'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  useEffect(() => {
    // Load expenses from localStorage
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }

    // Fetch exchange rates (mock implementation)
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    // Save expenses to localStorage whenever they change
    localStorage.setItem('expenses', JSON.stringify(expenses));
    calculateTotalsByCategory();
  }, [expenses, baseCurrency]);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=4f010fdf17fb4b50aa6441b3a015c379&base=USD`
      );
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) return amount;
    return (amount * exchangeRates[toCurrency]) / exchangeRates[fromCurrency];
  };

  const calculateTotalsByCategory = () => {
    const totals = {};
    categories.forEach(category => {
      totals[category] = expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => {
          const convertedAmount = convertCurrency(
            parseFloat(expense.amount),
            expense.currency,
            baseCurrency
          );
          return sum + convertedAmount;
        }, 0);
    });
    setTotalByCategory(totals);
  };

  // Prepare data for the line chart
  const prepareLineChartData = () => {
    const dataByDate = {};

    expenses.forEach(expense => {
      const date = expense.date;
      const amount = convertCurrency(expense.amount, expense.currency, baseCurrency);

      if (!dataByDate[date]) {
        dataByDate[date] = 0;
      }
      dataByDate[date] += amount;
    });

    return Object.entries(dataByDate).map(([date, total]) => ({
      date,
      total: parseFloat(total.toFixed(2))
    }));
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      }
    ]);

    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditExpense = (id) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    setEditingId(id);
    setNewExpense(expense);
  };

  const handleUpdateExpense = () => {
    setExpenses(expenses.map(expense =>
      expense.id === editingId ? { ...newExpense, id: editingId } : expense
    ));

    setEditingId(null);
    setNewExpense({
      description: '',
      amount: '',
      category: 'food',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Prepare data for charts
  const pieChartData = Object.entries(totalByCategory).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  const lineChartData = prepareLineChartData();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Budget Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <Input
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newExpense.currency}
                onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map(currency => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
              <Button
                className="w-full"
                onClick={editingId ? handleUpdateExpense : handleAddExpense}
              >
                {editingId ? <Save className="mr-2" /> : <Plus className="mr-2" />}
                {editingId ? 'Update Expense' : 'Add Expense'}
              </Button>
            </div>

            <div>
              <Select
                value={baseCurrency}
                onValueChange={(value) => setBaseCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select base currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(exchangeRates).map(currency => (
                    <SelectItem key={currency} value={currency}>
                      Display in {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <PieChart width={300} height={300}>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="55%"
                  cy="55%"
                  outerRadius={100}
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Line Chart */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Expense Trends Over Time</h2>
            <LineChart
              width={600}
              height={300}
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </div>

          {/* Expense Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id} className="border-t">
                    <td className="p-2">{expense.date}</td>
                    <td className="p-2">{expense.description}</td>
                    <td className="p-2">{expense.category}</td>
                    <td className="p-2 text-right">
                      {convertCurrency(expense.amount, expense.currency, baseCurrency).toFixed(2)} {baseCurrency}
                    </td>
                    <td className="p-2 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditExpense(expense.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;