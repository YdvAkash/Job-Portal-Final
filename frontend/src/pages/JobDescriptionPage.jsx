import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "../utils/const.js";
import { setSingleJob } from "../store/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import useGetJobById from "../hooks/useGetJobById.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Briefcase,
  Star,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";

const JobDescriptionPage = () => {
  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useGetJobById(jobId);

  const singleJob = useSelector((state) => state.job.singleJob);
  const { user } = useSelector((state) => state.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (singleJob?.applications && user?._id) {
      const hasApplied = singleJob.applications.some(
        (app) => app.applicant && app.applicant._id === user._id
      );
      setIsApplied(hasApplied);
    }
  }, [singleJob, user]);

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please log in to apply");
      navigate("/login");
      return;
    }
    setApplying(true);
    setIsApplied(true);
    try {
      await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      const response = await axios.get(`${JOB_API_END_POINT}/${jobId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setSingleJob(response.data.job));
      }
      toast.success("Applied successfully! 🎉");
    } catch (error) {
      setIsApplied(false);
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const daysAgo = (date) => {
    const diff = new Date() - new Date(date);
    const days = Math.floor(diff / (1000 * 24 * 60 * 60));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  if (!singleJob) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full" />
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  const jobTypeColor = {
    "Full Time": "bg-blue-50 text-blue-700 border-blue-200",
    "Part Time": "bg-orange-50 text-orange-700 border-orange-200",
    Remote: "bg-green-50 text-green-700 border-green-200",
    Internship: "bg-pink-50 text-pink-700 border-pink-200",
  };
  const typeClass = jobTypeColor[singleJob?.jobType] || "bg-purple-50 text-purple-700 border-purple-200";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0a28 0%, #2d1065 50%, #1a0b3e 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>

          {/* Company & Job Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Avatar className="w-20 h-20 rounded-2xl ring-4 ring-white/10 flex-shrink-0">
              <AvatarImage
                src={singleJob?.company?.logo}
                className="object-contain p-2"
              />
              <AvatarFallback className="rounded-2xl text-2xl font-bold text-white bg-purple-700">
                {singleJob?.company?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white font-outfit leading-tight">
                  {singleJob?.title}
                </h1>
                {isApplied && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Applied
                  </span>
                )}
              </div>

              <p className="text-white/60 text-lg mb-4">
                {singleJob?.company?.name}
              </p>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm border border-white/10">
                  <MapPin className="w-3.5 h-3.5" />
                  {singleJob?.location}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border ${typeClass}`}>
                  <Briefcase className="w-3.5 h-3.5" />
                  {singleJob?.jobType}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm border border-white/10">
                  <Clock className="w-3.5 h-3.5" />
                  {daysAgo(singleJob?.createdAt)}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex-shrink-0">
              {user?.role !== "recruiter" && (
                <button
                  onClick={isApplied ? null : applyJobHandler}
                  disabled={isApplied || applying}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 min-w-[160px] ${
                    isApplied
                      ? "bg-green-500/20 border border-green-500/50 text-green-300 cursor-default"
                      : "text-white hover:-translate-y-1"
                  }`}
                  style={
                    !isApplied
                      ? {
                          background: "linear-gradient(135deg, #F83002, #ff6b35)",
                          boxShadow: "0 8px 24px rgba(248,48,2,0.4)",
                        }
                      : {}
                  }
                >
                  {applying ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Applying...
                    </span>
                  ) : isApplied ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Applied!
                    </span>
                  ) : (
                    "Apply Now"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-600 rounded-full inline-block" />
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {singleJob?.description}
              </p>
            </div>

            {/* Requirements */}
            {singleJob?.requirements && singleJob.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
                  Requirements
                </h2>
                <div className="flex flex-wrap gap-2">
                  {singleJob.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
                      style={{
                        background: "rgba(106,56,194,0.08)",
                        color: "#6a38c2",
                        border: "1px solid rgba(106,56,194,0.2)",
                      }}
                    >
                      <Star className="w-3 h-3" />
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Details Sidebar */}
          <div className="space-y-5">
            {/* Job Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                {[
                  { icon: DollarSign, label: "Salary", value: `₹${singleJob?.salary} LPA`, color: "bg-green-50 text-green-600" },
                  { icon: Users, label: "Positions", value: `${singleJob?.position} Open`, color: "bg-blue-50 text-blue-600" },
                  { icon: Briefcase, label: "Experience", value: `${singleJob?.experience} Years`, color: "bg-purple-50 text-purple-600" },
                  { icon: MapPin, label: "Location", value: singleJob?.location, color: "bg-orange-50 text-orange-600" },
                  { icon: Calendar, label: "Posted", value: singleJob?.createdAt?.split("T")[0], color: "bg-gray-50 text-gray-600" },
                  { icon: Users, label: "Applicants", value: singleJob?.applications?.length || 0, color: "bg-pink-50 text-pink-600" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Info */}
            {singleJob?.company && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">About Company</h3>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12 rounded-xl">
                    <AvatarImage src={singleJob.company.logo} className="object-contain" />
                    <AvatarFallback className="rounded-xl bg-purple-100 text-purple-700 font-bold">
                      {singleJob.company.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {singleJob.company.name}
                    </h4>
                    <p className="text-xs text-gray-400">{singleJob.company.location}</p>
                  </div>
                </div>
                {singleJob.company.description && (
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
                    {singleJob.company.description}
                  </p>
                )}
                {singleJob.company.website && (
                  <a
                    href={singleJob.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-purple-600 hover:underline mt-3 font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
              </div>
            )}

            {/* Mobile Apply Button */}
            {user?.role !== "recruiter" && (
              <button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied || applying}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 lg:hidden ${
                  isApplied
                    ? "bg-green-50 border border-green-200 text-green-700 cursor-default"
                    : "text-white"
                }`}
                style={
                  !isApplied
                    ? {
                        background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                        boxShadow: "0 8px 24px rgba(106,56,194,0.4)",
                      }
                    : {}
                }
              >
                {isApplied ? "✓ Already Applied" : applying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionPage;
