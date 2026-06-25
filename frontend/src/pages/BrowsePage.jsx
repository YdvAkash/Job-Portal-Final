import React, { useEffect, useState } from "react";
import Job from "../components/shared/Job";
import FilterCard from "../components/shared/FilterCard";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { useDispatch, useSelector } from "react-redux";
import { setHomeSearchJobByText } from "../store/jobSlice";
import { Search, SlidersHorizontal, X, Briefcase } from "lucide-react";

function BrowsePage() {
  const dispatch = useDispatch();
  const { allJobs, jobError, homeSearchJobByText } = useSelector((store) => store.job);
  const [searchInput, setSearchInput] = useState(homeSearchJobByText || "");
  const [showFilters, setShowFilters] = useState(false);
  const { isLoading } = useGetAllJobs();

  useEffect(() => {
    return () => {
      dispatch(setHomeSearchJobByText(""));
    };
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setHomeSearchJobByText(searchInput));
  };

  const clearSearch = () => {
    setSearchInput("");
    dispatch(setHomeSearchJobByText(""));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 font-outfit">
            Browse{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              All Jobs
            </span>
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 bg-white hover:border-purple-300 hover:text-purple-700 transition-all lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </form>

          {/* Results count */}
          <p className="text-sm text-gray-500 mt-3">
            {isLoading ? "Searching..." : `${allJobs.length} jobs found${homeSearchJobByText ? ` for "${homeSearchJobByText}"` : ""}`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters — desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterCard />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
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
                  <Briefcase className="w-12 h-12 text-purple-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {jobError || "No jobs found"}
                </h3>
                <p className="text-gray-500 max-w-sm">
                  {homeSearchJobByText
                    ? `No results for "${homeSearchJobByText}". Try different keywords or clear filters.`
                    : "No jobs are available right now. Check back later!"}
                </p>
                {homeSearchJobByText && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;
