import React, { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Link2,
  Calendar,
  Type,
  AlignLeft,
  Eye,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
];

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [formData, setFormData] = useState({
    campaignName: "",
    title: "",
    description: "",
    videoLink: "",
    flatBudgetAmount: "",
    flatBudgetViews: "",
    performanceBudgetAmount: "",
    performanceBudgetViews: "",
    selectedPlatforms: [],
    hasEndDate: false,
    endDate: "",
    thumbnail: null,
  });

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "hasEndDate" && !value) {
        next.endDate = "";
      }
      return next;
    });
    setError("");
  };

  const handleTextChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setError("");
  };

  const validateAndSetThumbnail = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, thumbnail: file }));

    setThumbnailPreview((previousPreview) => {
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }
      return URL.createObjectURL(file);
    });
    setError("");
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    validateAndSetThumbnail(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!dragActive) setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragActive) setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const file = event.dataTransfer?.files?.[0];
    validateAndSetThumbnail(file);
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setFormData((prev) => ({ ...prev, thumbnail: null }));
    setThumbnailPreview(null);
  };

  const togglePlatform = (platform) => {
    setFormData((prev) => {
      const alreadySelected = prev.selectedPlatforms.includes(platform);
      const updatedPlatforms = alreadySelected
        ? prev.selectedPlatforms.filter((item) => item !== platform)
        : [...prev.selectedPlatforms, platform];
      return { ...prev, selectedPlatforms: updatedPlatforms };
    });
    setError("");
  };

  const flatBudgetAmountValue = useMemo(
    () => (formData.flatBudgetAmount ? parseFloat(formData.flatBudgetAmount) : 0),
    [formData.flatBudgetAmount]
  );
  const flatBudgetViewsValue = useMemo(
    () => (formData.flatBudgetViews ? parseInt(formData.flatBudgetViews, 10) : 0),
    [formData.flatBudgetViews]
  );
  const performanceBudgetAmountValue = useMemo(
    () => (formData.performanceBudgetAmount ? parseFloat(formData.performanceBudgetAmount) : 0),
    [formData.performanceBudgetAmount]
  );
  const performanceBudgetViewsValue = useMemo(
    () => (formData.performanceBudgetViews ? parseInt(formData.performanceBudgetViews, 10) : 0),
    [formData.performanceBudgetViews]
  );

  const totalBudget = useMemo(
    () => Math.max(flatBudgetAmountValue + performanceBudgetAmountValue, 0),
    [flatBudgetAmountValue, performanceBudgetAmountValue]
  );

  const estimatedViews = useMemo(
    () => Math.max(flatBudgetViewsValue + performanceBudgetViewsValue, 0),
    [flatBudgetViewsValue, performanceBudgetViewsValue]
  );

  const validateVideoLink = (link) => {
    if (!link) return true;
    try {
      // eslint-disable-next-line no-new
      new URL(link);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user?.id) {
      setError("You must be logged in to create a campaign");
      return;
    }

    if (!formData.campaignName.trim()) {
      setError("Campaign name is required");
      return;
    }

    if (!formData.title.trim()) {
      setError("Public title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!formData.flatBudgetAmount || flatBudgetAmountValue <= 0) {
      setError("Flat budget amount must be greater than 0");
      return;
    }

    if (!formData.flatBudgetViews || flatBudgetViewsValue <= 0) {
      setError("Flat budget views must be greater than 0");
      return;
    }

    const performanceAmountProvided = formData.performanceBudgetAmount !== "";
    const performanceViewsProvided = formData.performanceBudgetViews !== "";

    if (performanceAmountProvided && performanceBudgetAmountValue < 0) {
      setError("Performance budget amount cannot be negative");
      return;
    }

    if (performanceViewsProvided && performanceBudgetViewsValue < 0) {
      setError("Performance budget views cannot be negative");
      return;
    }

    if (performanceAmountProvided !== performanceViewsProvided) {
      setError("Please provide both amount and views for performance budget");
      return;
    }

    if (!formData.selectedPlatforms.length) {
      setError("Select at least one platform");
      return;
    }

    if (formData.hasEndDate && !formData.endDate) {
      setError("Please select an end date");
      return;
    }

    if (!validateVideoLink(formData.videoLink.trim())) {
      setError("Please provide a valid video link URL");
      return;
    }

    setLoading(true);

    try {
      const totalBudgetValue = totalBudget;
      const estimatedViewsValue = estimatedViews;
      const performanceAmount = performanceAmountProvided ? performanceBudgetAmountValue : 0;
      const performanceViews = performanceViewsProvided ? performanceBudgetViewsValue : 0;

      const payload = new FormData();
      payload.append("creatorId", user.id);
      payload.append("name", formData.campaignName.trim());
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("budget", totalBudgetValue.toString());
      payload.append("videoLink", formData.videoLink.trim());
      payload.append("flatBudgetAmount", flatBudgetAmountValue.toString());
      payload.append("flatBudgetViews", flatBudgetViewsValue.toString());
      payload.append("performanceBudgetAmount", performanceAmount.toString());
      payload.append("performanceBudgetViews", performanceViews.toString());
      payload.append("estimatedViews", estimatedViewsValue.toString());
      payload.append("platforms", JSON.stringify(formData.selectedPlatforms));
      payload.append("hasEndDate", formData.hasEndDate ? "true" : "false");
      if (formData.hasEndDate && formData.endDate) {
        payload.append("endDate", formData.endDate);
      }
      if (formData.thumbnail) {
        payload.append("thumbnail", formData.thumbnail);
      }

      const response = await axios.post("/campaigns", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        navigate("/analytics");
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      setError(err.response?.data?.error || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
          type="button"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create New Campaign</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Craft your campaign details before publishing to clippers.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Media & Budget</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Provide your creative assets and campaign performance targets.</p>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Campaign Thumbnail</label>
                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex items-center justify-center rounded-xl border-2 border-dashed transition-all h-48 overflow-hidden bg-gray-50 dark:bg-gray-900/60 ${
                    dragActive ? "border-indigo-500 bg-indigo-50/60 dark:border-indigo-400 dark:bg-indigo-500/10" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {thumbnailPreview ? (
                    <div className="w-full h-full relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center text-center px-6">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        Drag & drop or <span className="text-indigo-600 dark:text-indigo-400">upload</span>
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {!thumbnailPreview && (
                    <div className="absolute bottom-3 right-3">
                      <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" /> Upload
                        <input type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Link */}
              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Video Link</label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.videoLink}
                    onChange={handleTextChange("videoLink")}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Optional link for reference creatives or launch content.</p>
              </div>

              {/* Budget Inputs */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Total Budget</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Flat Budget (Required)</p>
                    <div className="space-y-3">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Amount"
                          value={formData.flatBudgetAmount}
                          onChange={handleTextChange("flatBudgetAmount")}
                          className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Eye className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Views"
                          value={formData.flatBudgetViews}
                          onChange={handleTextChange("flatBudgetViews")}
                          className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/20">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performance Budget (Optional)</p>
                    <div className="space-y-3">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Amount"
                          value={formData.performanceBudgetAmount}
                          onChange={handleTextChange("performanceBudgetAmount")}
                          className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <Eye className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Views"
                          value={formData.performanceBudgetViews}
                          onChange={handleTextChange("performanceBudgetViews")}
                          className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-700">
                    <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">Total Budget</p>
                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-200 mt-1">${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-200 mt-1">Calculated as flat + performance budgets.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-700">
                    <p className="text-sm text-emerald-600 dark:text-emerald-300 font-medium">Estimated Views</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-200 mt-1">{estimatedViews.toLocaleString()}</p>
                    <p className="text-xs text-emerald-500 dark:text-emerald-200 mt-1">Based on your view targets for each budget.</p>
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-3">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Choose Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((platform) => {
                    const isSelected = formData.selectedPlatforms.includes(platform.value);
                    return (
                      <button
                        key={platform.value}
                        type="button"
                        onClick={() => togglePlatform(platform.value)}
                        className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                        }`}
                      >
                        {platform.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Select all platforms where this campaign should appear.</p>
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="end-date-toggle"
                    type="checkbox"
                    checked={formData.hasEndDate}
                    onChange={handleInputChange("hasEndDate")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="end-date-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Set an end date
                  </label>
                </div>
                {formData.hasEndDate && (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={handleTextChange("endDate")}
                      className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Campaign Details</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Provide messaging that guides internal stakeholders and clippers.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Campaign Name</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Internal launch name"
                    value={formData.campaignName}
                    onChange={handleTextChange("campaignName")}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">This name stays internal and is hidden from clippers.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Title *</label>
                <div className="relative">
                  <Type className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Headline shown to clippers"
                    value={formData.title}
                    onChange={handleTextChange("title")}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">Description *</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    placeholder="Describe campaign objectives, tone, deliverables, and any key messaging."
                    value={formData.description}
                    onChange={handleTextChange("description")}
                    rows={10}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publishing...
                </>
              ) : (
                "Publish Campaign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
