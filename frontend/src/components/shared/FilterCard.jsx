import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setHomeSearchJobByText } from "../../store/jobSlice";
import { SlidersHorizontal, X } from "lucide-react";

// FIXED: added `key` property to each group so `group.key` works correctly
const filterData = [
  {
    filterType: "Location",
    key: "location",
    icon: "📍",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Remote"],
  },
  {
    filterType: "Industry",
    key: "industry",
    icon: "💼",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "Data Scientist",
      "DevOps Engineer",
      "UI/UX Designer",
    ],
  },
  {
    filterType: "Job Type",
    key: "jobType",
    icon: "🕐",
    array: ["Full Time", "Part Time", "Internship", "Remote", "Contract"],
  },
  {
    filterType: "Experience",
    key: "experience",
    icon: "⭐",
    array: ["Fresher", "1-3 years", "3-5 years", "5+ years"],
  },
];

const FilterCard = () => {
  const [selected, setSelected] = useState({
    location: "",
    industry: "",
    jobType: "",
    experience: "",
  });
  const dispatch = useDispatch();

  const handleChange = (key, value) => {
    setSelected((prev) => {
      // Toggle off if already selected
      if (prev[key] === value) return { ...prev, [key]: "" };
      return { ...prev, [key]: value };
    });
  };

  const clearAll = () => {
    setSelected({ location: "", industry: "", jobType: "", experience: "" });
  };

  const hasFilters = Object.values(selected).some(Boolean);

  useEffect(() => {
    const parts = Object.values(selected).filter(Boolean);
    const combined = parts.join("|");
    dispatch(setHomeSearchJobByText(combined));
  }, [selected, dispatch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-gray-900 text-base">Filters</h2>
          {hasFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white text-xs font-bold">
              {Object.values(selected).filter(Boolean).length}
            </span>
          )}
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="p-4 space-y-5">
        {filterData.map((group) => (
          <div key={group.filterType}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{group.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{group.filterType}</h3>
            </div>
            <div className="space-y-1.5">
              {group.array.map((item) => {
                const isChecked = selected[group.key] === item;
                return (
                  <button
                    key={item}
                    onClick={() => handleChange(group.key, item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                      isChecked
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isChecked
                          ? "border-purple-600 bg-purple-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isChecked && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-left">{item}</span>
                  </button>
                );
              })}
            </div>
            <div className="border-b border-gray-100 mt-4" />
          </div>
        ))}
      </div>

      {/* Active Filters Summary */}
      {hasFilters && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(selected)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => handleChange(k, v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  {v}
                  <X className="w-3 h-3" />
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterCard;