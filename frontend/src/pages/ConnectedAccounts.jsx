import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { Youtube, Instagram, Award, Link2, CheckCircle, Plus, X, ExternalLink } from "lucide-react";

const platformConfig = {
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "red",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-500",
    textColor: "text-red-500",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "pink",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    borderColor: "border-pink-500",
    textColor: "text-pink-500",
  },
  tiktok: {
    name: "TikTok",
    icon: Award,
    color: "gray",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    borderColor: "border-gray-900 dark:border-white",
    textColor: "text-gray-900 dark:text-white",
  },
};

function ConnectedAccounts() {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    accountId: "",
  });

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const [accountsRes, availableRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/connected-accounts/user/${user.id}`),
        axios.get(`http://localhost:5000/api/connected-accounts/user/${user.id}/available`),
      ]);
      
      setConnectedAccounts(accountsRes.data);
      setAvailablePlatforms(availableRes.data.available);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setLoading(false);
    }
  };

  const handleConnectClick = (platform) => {
    setSelectedPlatform(platform);
    setShowConnectModal(true);
    setFormData({ username: "", accountId: "" });
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:5000/api/connected-accounts", {
        userId: user.id,
        platform: selectedPlatform,
        username: formData.username,
        accountId: formData.accountId,
      });
      
      setShowConnectModal(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error connecting account:", error);
      alert("Failed to connect account. Please try again.");
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!confirm("Are you sure you want to disconnect this account?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/connected-accounts/${accountId}`);
      fetchAccounts();
    } catch (error) {
      console.error("Error disconnecting account:", error);
      alert("Failed to disconnect account. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connected Accounts</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your social media platform connections
        </p>
      </div>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Connected Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedAccounts.map((account) => {
              const config = platformConfig[account.platform];
              const Icon = config.icon;
              
              return (
                <div
                  key={account.id}
                  className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-6 relative`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full bg-white dark:bg-gray-900`}>
                        <Icon className={`w-8 h-8 ${config.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{config.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          @{account.username}
                        </p>
                      </div>
                    </div>
                    <CheckCircle className={`w-6 h-6 ${config.textColor} fill-current`} />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Account ID:</span>
                      <span className="font-mono text-xs">{account.accountId}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Connected:</span>
                      <span className="text-xs">
                        {new Date(account.connectedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                  >
                    Disconnect
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Connected Accounts */}
      {connectedAccounts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center mb-8">
          <Link2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Connected Accounts</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Connect your social media accounts to start tracking your content
          </p>
        </div>
      )}

      {/* Available Platforms to Connect */}
      {availablePlatforms.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlatforms.map((platform) => {
              const config = platformConfig[platform];
              const Icon = config.icon;
              
              return (
                <div
                  key={platform}
                  className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer"
                  onClick={() => handleConnectClick(platform)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-full ${config.bgColor}`}>
                      <Icon className={`w-8 h-8 ${config.textColor}`} />
                    </div>
                    <h3 className="font-bold text-lg">{config.name}</h3>
                  </div>
                  
                  <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Connect Account
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Platforms Connected */}
      {availablePlatforms.length === 0 && connectedAccounts.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
            All Platforms Connected!
          </h3>
          <p className="text-green-600 dark:text-green-300 text-sm">
            You've connected all available social media platforms
          </p>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && selectedPlatform && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowConnectModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const config = platformConfig[selectedPlatform];
                  const Icon = config.icon;
                  return (
                    <>
                      <div className={`p-3 rounded-full ${config.bgColor}`}>
                        <Icon className={`w-8 h-8 ${config.textColor}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Connect {config.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enter your account details
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                    placeholder="@username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Account ID</label>
                  <input
                    type="text"
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                    placeholder="Platform account ID"
                    required
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> In a production environment, this would use OAuth
                    authentication for secure account linking.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                  >
                    Connect
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

export default ConnectedAccounts;
