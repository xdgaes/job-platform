import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  ThumbsUp, 
  Share2, 
  DollarSign, 
  Calendar,
  ChevronDown,
  Trophy,
  Youtube,
  Instagram,
  Award,
  Plus
} from "lucide-react";

function Analytics() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("all");
  const [customDays, setCustomDays] = useState(30);

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCampaign) {
      fetchCampaignData();
    }
  }, [selectedCampaign, dateFilter, customDays]);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/campaigns/user/${user.id}`);
      setCampaigns(response.data);
      if (response.data.length > 0) {
        setSelectedCampaign(response.data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setLoading(false);
    }
  };

  const fetchCampaignData = async () => {
    try {
      let params = {};
      if (dateFilter !== "all") {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - customDays);
        params = {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        };
      }

      const response = await axios.get(
        `http://localhost:5000/api/campaigns/${selectedCampaign}`,
        { params }
      );
      setCampaignData(response.data);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    }
  };

  const calculatePlatformPercentages = () => {
    if (!campaignData?.analytics) return { youtube: 0, instagram: 0, tiktok: 0 };
    
    const { youtubeViews, instagramViews, tiktokViews, totalViews } = campaignData.analytics;
    
    if (totalViews === 0) return { youtube: 0, instagram: 0, tiktok: 0 };

    return {
      youtube: ((youtubeViews / totalViews) * 100).toFixed(1),
      instagram: ((instagramViews / totalViews) * 100).toFixed(1),
      tiktok: ((tiktokViews / totalViews) * 100).toFixed(1),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Campaigns Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first campaign to start tracking analytics
          </p>
          <button
            onClick={() => navigate("/create-campaign")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>
      </div>
    );
  }

  const platformPercentages = calculatePlatformPercentages();

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header with Campaign Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Campaign Analytics</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/create-campaign")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
          {/* Campaign Selector */}
          <div className="relative">
            <select
              value={selectedCampaign || ""}
              onChange={(e) => setSelectedCampaign(parseInt(e.target.value))}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
            >
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="custom">Last X Days</option>
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {dateFilter === "custom" && (
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value))}
              placeholder="Days"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min="1"
            />
          )}
        </div>
      </div>

      {campaignData && (
        <>
          {/* Campaign Info Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{campaignData.name}</h2>
            {campaignData.description && (
              <p className="text-indigo-100 mb-4">{campaignData.description}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-indigo-200 text-sm">Budget</p>
                <p className="text-2xl font-bold">${campaignData.budget.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Total Spent</p>
                <p className="text-2xl font-bold">${campaignData.totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Remaining</p>
                <p className="text-2xl font-bold">
                  ${(campaignData.budget - campaignData.totalSpent).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-indigo-200 text-sm">Status</p>
                <p className="text-2xl font-bold capitalize">{campaignData.status}</p>
              </div>
            </div>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Views</p>
                  <p className="text-3xl font-bold">
                    {campaignData.analytics?.totalViews.toLocaleString() || 0}
                  </p>
                </div>
                <Eye className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Likes</p>
                  <p className="text-3xl font-bold">
                    {campaignData.analytics?.totalLikes.toLocaleString() || 0}
                  </p>
                </div>
                <ThumbsUp className="w-12 h-12 text-pink-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Shares</p>
                  <p className="text-3xl font-bold">
                    {campaignData.analytics?.totalShares.toLocaleString() || 0}
                  </p>
                </div>
                <Share2 className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Total Clippers</p>
                  <p className="text-3xl font-bold">
                    {campaignData.analytics?.totalClippers || 0}
                  </p>
                </div>
                <Users className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          </div>

          {/* CPM & Platform Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* CPM Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-green-500" />
                <h3 className="text-xl font-semibold">Cost Per Mille (CPM)</h3>
              </div>
              <p className="text-4xl font-bold text-green-500">
                ${campaignData.analytics?.cpm.toFixed(2) || "0.00"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Cost per 1,000 views
              </p>
            </div>

            {/* Platform Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Views by Platform</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-500" />
                      <span className="font-medium">YouTube</span>
                    </div>
                    <span className="font-bold">{platformPercentages.youtube}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all"
                      style={{ width: `${platformPercentages.youtube}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span className="font-medium">Instagram</span>
                    </div>
                    <span className="font-bold">{platformPercentages.instagram}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full transition-all"
                      style={{ width: `${platformPercentages.instagram}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-gray-900 dark:text-white" />
                      <span className="font-medium">TikTok</span>
                    </div>
                    <span className="font-bold">{platformPercentages.tiktok}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gray-900 dark:bg-white h-3 rounded-full transition-all"
                      style={{ width: `${platformPercentages.tiktok}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Clippers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h3 className="text-2xl font-semibold">Featured Clippers</h3>
            </div>

            {campaignData.featuredClippers && campaignData.featuredClippers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Clipper ID</th>
                      <th className="text-left py-3 px-4">Views</th>
                      <th className="text-left py-3 px-4">Likes</th>
                      <th className="text-left py-3 px-4">Reward Earned</th>
                      <th className="text-left py-3 px-4">Clips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignData.featuredClippers.map((clipper, index) => (
                      <tr
                        key={clipper.clipperId}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <Trophy
                                className={`w-5 h-5 ${
                                  index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                    ? "text-gray-400"
                                    : "text-orange-600"
                                }`}
                              />
                            )}
                            <span className="font-bold">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">Clipper {clipper.clipperId}</td>
                        <td className="py-3 px-4">{clipper.totalViews.toLocaleString()}</td>
                        <td className="py-3 px-4">{clipper.totalLikes.toLocaleString()}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">
                          ${clipper.totalReward.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">{clipper.clipCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No clippers data available yet
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
