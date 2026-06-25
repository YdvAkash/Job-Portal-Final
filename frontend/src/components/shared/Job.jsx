import React from "react";
import { Bookmark, MapPin, Clock, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Job = ({ job, index = 0 }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const jobTypeColor = {
    "Full Time": "bg-blue-50 text-blue-700 border-blue-200",
    "Part Time": "bg-orange-50 text-orange-700 border-orange-200",
    Remote: "bg-green-50 text-green-700 border-green-200",
    Internship: "bg-pink-50 text-pink-700 border-pink-200",
    Contract: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  const typeClass =
    jobTypeColor[job?.jobType] || "bg-purple-50 text-purple-700 border-purple-200";

  return (
    <div
      className="job-card cursor-pointer group"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => navigate(`/description/${job?._id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12 rounded-xl border-2 border-gray-100 shadow-sm">
              <AvatarImage
                src={job?.company?.logo}
                className="object-contain p-1"
              />
              <AvatarFallback className="rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 font-bold text-sm">
                {job?.company?.name?.charAt(0)?.toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-purple-700 transition-colors">
              {job?.company?.name}
            </h2>
            <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{job?.location || "India"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {daysAgoFunction(job?.createdAt)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Job Info */}
      <div className="mb-4">
        <h1 className="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-purple-700 transition-colors line-clamp-1">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeClass}`}
        >
          {job?.jobType}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Users className="w-3 h-3" />
          {job?.position} {job?.position === 1 ? "Position" : "Positions"}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          <DollarSign className="w-3 h-3" />
          {job?.salary} LPA
        </span>
      </div>

      {/* Action */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-200"
        >
          View Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #6a38c2, #7209b7)",
            boxShadow: "0 4px 12px rgba(106,56,194,0.3)",
          }}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default Job;