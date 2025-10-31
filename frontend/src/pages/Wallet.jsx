import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import axios from "../api/axios";
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Clock,
  DollarSign,
  X,
} from "lucide-react";

function Wallet() {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(`/wallet/${user.id}`);
      setWallet(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await axios.post(`/wallet/${user.id}/add`, {
        amount: parseFloat(amount),
        description: description || "Funds added",
      });
      
      setWallet(response.data);
      setShowAddModal(false);
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("Failed to add funds. Please try again.");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > wallet.balance) {
      alert("Insufficient balance");
      return;
    }

    try {
      const response = await axios.post(`/wallet/${user.id}/withdraw`, {
        amount: parseFloat(amount),
        description: description || "Funds withdrawn",
      });
      
      setWallet(response.data);
      setShowWithdrawModal(false);
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert(error.response?.data?.error || "Failed to withdraw funds. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const calculateStats = () => {
    if (!wallet || !wallet.transactions || wallet.transactions.length === 0) {
      return { totalIncome: 0, totalExpense: 0, transactionCount: 0 };
    }

    const totalIncome = wallet.transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = wallet.transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      transactionCount: wallet.transactions.length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wallet</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your funds and view transaction history
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <WalletIcon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Total Balance</p>
              <h2 className="text-4xl font-bold">
                ${wallet?.balance?.toFixed(2) || "0.00"}
              </h2>
            </div>
          </div>
          <CreditCard className="w-16 h-16 text-white/30" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-300" />
              <p className="text-indigo-100 text-sm">Total Income</p>
            </div>
            <p className="text-2xl font-bold">${stats.totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-5 h-5 text-red-300" />
              <p className="text-indigo-100 text-sm">Total Expense</p>
            </div>
            <p className="text-2xl font-bold">${stats.totalExpense.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Transactions</p>
              <p className="text-3xl font-bold">{stats.transactionCount}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Available</p>
              <p className="text-3xl font-bold text-green-500">
                ${wallet?.balance?.toFixed(2) || "0.00"}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Net Flow</p>
              <p
                className={`text-3xl font-bold ${
                  stats.totalIncome - stats.totalExpense >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ${(stats.totalIncome - stats.totalExpense).toFixed(2)}
              </p>
            </div>
            <TrendingUp
              className={`w-12 h-12 ${
                stats.totalIncome - stats.totalExpense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
        
        {wallet?.transactions && wallet.transactions.length > 0 ? (
          <div className="space-y-3">
            {wallet.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      transaction.type === "credit"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      transaction.type === "credit"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setAmount("");
                setDescription("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Plus className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Add Funds</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add money to your wallet
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddFunds} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 text-lg"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                    placeholder="E.g., Monthly deposit"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setAmount("");
                      setDescription("");
                    }}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    Add Funds
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => {
                setShowWithdrawModal(false);
                setAmount("");
                setDescription("");
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <Download className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Withdraw Funds</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Available: ${wallet?.balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 text-lg"
                      placeholder="0.00"
                      max={wallet?.balance || 0}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700"
                    placeholder="E.g., Bank transfer"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setAmount("");
                      setDescription("");
                    }}
                    className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    Withdraw
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
