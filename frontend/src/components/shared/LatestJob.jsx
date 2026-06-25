import React from "react";
import Job from "./Job";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function LatestJob() {
  const { allJobs } = useSelector((state) => state.job);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-2">
            ✨ Just Posted
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-outfit">
            <span
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Latest &amp; Top
            </span>{" "}
            Job Openings
          </h2>
        </div>
        <Link
          to="/browse"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-200"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Jobs Grid */}
      {allJobs && allJobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allJobs.slice(0, 8).map((job, index) => (
              <Job key={job._id} job={job} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
            >
              View All Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs available</h3>
          <p className="text-gray-400">Check back later for new opportunities</p>
        </div>
      )}
    </section>
  );
}

export default LatestJob;
