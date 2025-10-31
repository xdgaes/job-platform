import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  ArrowLeft,
  UserCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Eye,
  DollarSign,
  TrendingUp,
  Loader2,
  Link2,
  PlayCircle,
  Video,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const REFRESH_INTERVAL_MS = 15000;

const numberFormatter = new Intl.NumberFormat();
const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const parseVideoLink = (rawUrl = "") => {
  if (!rawUrl) {
    return { type: "empty", src: null };
  }

  const url = rawUrl.trim();

  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/i);
  if (youtubeMatch) {
    return { type: "iframe", src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch) {
    return { type: "iframe", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  if (/\.(mp4|mov|webm|ogg)$/i.test(url)) {
    return { type: "video", src: url };
  }

  return { type: "link", src: url };
};

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const { user, mode } = useContext(AuthContext);

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const [clipTitle, setClipTitle] = useState("");
  const [clipPlatform, setClipPlatform] = useState("youtube");
  const [clipLink, setClipLink] = useState("");
  const [submittingClip, setSubmittingClip] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const hasLoadedRef = useRef(false);
  const lastCampaignIdRef = useRef(null);

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;

    if (lastCampaignIdRef.current !== campaignId) {
      lastCampaignIdRef.current = campaignId;
      hasLoadedRef.current = false;
    }

    try {
      if (!hasLoadedRef.current) {
        setLoading(true);
      } else {
        setIsPolling(true);
      }

      const response = await axios.get(`/campaigns/${campaignId}`);
      setCampaign(response.data);
      setError(null);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error("Error fetching campaign details:", err);
      setError(
        err?.response?.data?.error || "Unable to load campaign details right now."
      );
    } finally {
      setLoading(false);
      setIsPolling(false);
    }
  }, [campaignId]);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const load = async () => {
      if (!isMounted) return;
      await fetchCampaign();
    };

    load();

    intervalId = setInterval(() => {
      load();
    }, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchCampaign]);

  const analytics = campaign?.analytics || {
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalClippers: 0,
  };

  const ongoingRewardPercentage = useMemo(() => {
    if (!campaign?.budget || campaign.budget <= 0) return 0;
    return Math.min(100, (campaign.totalSpent / campaign.budget) * 100);
  }, [campaign]);

  const parsedVideoLink = useMemo(
    () => parseVideoLink(campaign?.videoLink),
    [campaign?.videoLink]
  );

  const clipSubmissionDisabled = mode === "creator";

  const resetSubmissionState = () => {
    setSubmissionMessage(null);
    setSubmissionError(null);
  };

  const handleClipSubmit = async (event) => {
    event.preventDefault();
    resetSubmissionState();

    if (!clipTitle.trim()) {
      setSubmissionError("Please provide a clip title.");
      return;
    }

    if (!clipLink.trim()) {
      setSubmissionError("Please provide the clip link you want to submit.");
      return;
    }

    if (!user?.id) {
      setSubmissionError("You must be logged in to submit a clip.");
      return;
    }

    try {
      setSubmittingClip(true);
      await axios.post("/campaigns/clips", {
        campaignId: parseInt(campaignId, 10),
        clipperId: user.id,
        title: clipTitle.trim(),
        platform: clipPlatform,
        videoUrl: clipLink.trim(),
        views: 0,
        likes: 0,
        shares: 0,
        rewardEarned: 0,
      });

      setSubmissionMessage("Thanks! Your clip has been submitted for review.");
      setClipTitle("");
      setClipLink("");
      setClipPlatform("youtube");

      // Refresh campaign data to keep live stats up to date
      fetchCampaign();
    } catch (err) {
      console.error("Error submitting clip:", err);
      setSubmissionError(
        err?.response?.data?.error || "Failed to submit clip. Please try again."
      );
    } finally {
      setSubmittingClip(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow rounded-2xl p-10 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchCampaign}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {isPolling && (
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Live updating
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          {/* Video Preview */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              {parsedVideoLink.type === "iframe" && (
                <iframe
                  src={parsedVideoLink.src}
                  title={campaign.title || campaign.name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}

              {parsedVideoLink.type === "video" && (
                <video
                  src={parsedVideoLink.src}
                  controls
                  className="w-full h-full object-cover"
                />
              )}

              {parsedVideoLink.type === "link" && (
                <div className="flex flex-col items-center gap-4 text-center px-6">
                  <PlayCircle className="h-14 w-14 text-indigo-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    This campaign uses an external reference video.
                  </p>
                  <a
                    href={parsedVideoLink.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Link2 className="h-4 w-4" />
                    Open reference video
                  </a>
                </div>
              )}

              {parsedVideoLink.type === "empty" && (
                <div className="flex flex-col items-center gap-3 text-center px-6 py-12">
                  <Video className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No video preview has been provided for this campaign yet.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                  Campaign Details
                </span>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {campaign.title || campaign.name}
                </h1>
                {campaign.name && campaign.title && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Internal name: {campaign.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {campaign.creator?.profilePicture ? (
                    <img
                      src={campaign.creator.profilePicture}
                      alt={campaign.creator.name}
                      className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
                      <UserCircle className="h-10 w-10" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Creator</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.creator?.name || "Unknown Creator"}
                    </p>
                    {campaign.creator?.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{campaign.creator.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {numberFormatter.format(analytics.totalLikes || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">N/A</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {numberFormatter.format(analytics.totalShares || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {campaign.description && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide mb-2">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {campaign.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  Rewards Breakdown
                </p>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  Campaign Incentives
                </h2>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>

            <div className="space-y-4">
              <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  Flat Reward
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {campaign.flatBudgetAmount > 0 && campaign.flatBudgetViews > 0
                    ? `${currencyFormatter.format(campaign.flatBudgetAmount)} for every ${numberFormatter.format(campaign.flatBudgetViews)} views`
                    : "Not configured"}
                </p>
              </div>

              <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  Performance Reward
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {campaign.performanceBudgetAmount > 0 && campaign.performanceBudgetViews > 0
                    ? `${currencyFormatter.format(campaign.performanceBudgetAmount)} for every ${numberFormatter.format(campaign.performanceBudgetViews)} views`
                    : "Not configured"}
                </p>
              </div>

              <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                    Ongoing Reward Distribution
                  </p>
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {ongoingRewardPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-indigo-600"
                    style={{ width: `${ongoingRewardPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    Distributed: {currencyFormatter.format(campaign.totalSpent || 0)}
                  </span>
                  <span>
                    Budget: {currencyFormatter.format(campaign.budget || 0)}
                  </span>
                </div>
              </div>

              <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {numberFormatter.format(analytics.totalViews || 0)}
                  </p>
                </div>
                <Eye className="h-10 w-10 text-indigo-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
                Snapshot
              </p>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Updated every {Math.round(REFRESH_INTERVAL_MS / 1000)}s
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4">
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  Active Clippers
                </p>
                <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mt-1">
                  {numberFormatter.format(analytics.totalClippers || 0)}
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Remaining Budget
                </p>
                <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 mt-1">
                  {currencyFormatter.format((campaign.budget || 0) - (campaign.totalSpent || 0))}
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-4">
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                  Estimated Views
                </p>
                <p className="text-lg font-semibold text-orange-700 dark:text-orange-300 mt-1">
                  {numberFormatter.format(campaign.estimatedViews || 0)}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-500/10 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Status
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white mt-1 capitalize">
                  {campaign.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clip submission section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold">
              Submit Your Clip
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Share your latest edit
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Drop your clip link below to participate in this campaign.
            </p>
          </div>

          {clipSubmissionDisabled && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">
                You are in creator mode. Switch to clipper to submit clips.
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleClipSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Clip title
            </label>
            <input
              type="text"
              value={clipTitle}
              onChange={(e) => setClipTitle(e.target.value)}
              placeholder="e.g. Best highlights"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={clipSubmissionDisabled}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Platform
            </label>
            <select
              value={clipPlatform}
              onChange={(e) => setClipPlatform(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={clipSubmissionDisabled}
            >
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Clip link
            </label>
            <input
              type="url"
              value={clipLink}
              onChange={(e) => setClipLink(e.target.value)}
              placeholder="https://"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={clipSubmissionDisabled}
            />
          </div>

          <div className="md:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-2">
              {submissionMessage && (
                <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {submissionMessage}
                </div>
              )}

              {submissionError && (
                <div className="inline-flex items-center gap-2 text-sm font-medium text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {submissionError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={clipSubmissionDisabled || submittingClip}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                clipSubmissionDisabled
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {submittingClip ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit clip"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent clips */}
      {campaign.clips && campaign.clips.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold">
                Latest Clips
              </p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Community submissions
              </h3>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Sorted by views
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    Clip Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    Likes
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
                    Reward Earned
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {campaign.clips.map((clip) => (
                  <tr key={clip.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      <div className="flex flex-col">
                        <span className="font-medium">{clip.title}</span>
                        <a
                          href={clip.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          View clip
                        </a>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700 dark:text-gray-300">
                      {clip.platform}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {numberFormatter.format(clip.views || 0)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {numberFormatter.format(clip.likes || 0)}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {currencyFormatter.format(clip.rewardEarned || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
