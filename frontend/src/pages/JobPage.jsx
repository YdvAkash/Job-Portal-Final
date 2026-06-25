import React, { useEffect, useState } from "react";
import FilterCard from "../components/shared/FilterCard";
import Job from "../components/shared/Job";
import { useSelector, useDispatch } from "react-redux";
import { setHomeSearchJobByText } from "../store/jobSlice";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { Briefcase, SlidersHorizontal, X, Search } from "lucide-react";

function JobPage() {
  const dispatch = useDispatch();
  const { allJobs, homeSearchJobByText } = useSelector((state) => state.job);
  const [showFilters, setShowFilters] = useState(false);
  const { isLoading } = useGetAllJobs();

  useEffect(() => {
    dispatch(setHomeSearchJobByText(""));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-outfit">
                Find Your{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Dream Job
                </span>
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {isLoading
                  ? "Loading jobs..."
                  : `${allJobs.length} job${allJobs.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 bg-white hover:border-purple-300 hover:text-purple-700 transition-all lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterCard />
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterCard />
                </div>
              </div>
            </div>
          )}

          {/* Job Listings */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl skeleton" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 skeleton rounded-lg w-3/4" />
                        <div className="h-3 skeleton rounded-lg w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 skeleton rounded-lg" />
                      <div className="h-3 skeleton rounded-lg" />
                      <div className="h-3 skeleton rounded-lg w-4/5" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-6 skeleton rounded-full w-20" />
                      <div className="h-6 skeleton rounded-full w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {allJobs.map((job, index) => (
                  <Job key={job._id} job={job} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                  <Search className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No jobs found</h3>
                <p className="text-gray-500 max-w-sm">
                  {homeSearchJobByText
                    ? `No results for "${homeSearchJobByText}". Try adjusting filters.`
                    : "No jobs are available right now."}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default JobPage;
