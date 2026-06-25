import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHomeSearchJobByText } from "../../store/jobSlice";

const categories = [
  { label: "Engineering", icon: "⚙️", color: "#6a38c2" },
  { label: "Marketing", icon: "📣", color: "#F83002" },
  { label: "Finance", icon: "💰", color: "#059669" },
  { label: "Healthcare", icon: "🏥", color: "#0ea5e9" },
  { label: "Education", icon: "🎓", color: "#8b5cf6" },
  { label: "Design", icon: "🎨", color: "#ec4899" },
  { label: "Sales", icon: "📈", color: "#f59e0b" },
  { label: "Technology", icon: "💻", color: "#7209b7" },
  { label: "Management", icon: "👔", color: "#374151" },
  { label: "Data Science", icon: "📊", color: "#2563eb" },
  { label: "DevOps", icon: "🔧", color: "#047857" },
  { label: "Remote Jobs", icon: "🌍", color: "#dc2626" },
];

function CategoryCarousel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setHomeSearchJobByText(query));
    navigate("/browse");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-3">
          🔥 Popular Categories
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-outfit">
          Explore Job{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6a38c2, #7209b7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Categories
          </span>
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Find opportunities in your field of expertise
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map(({ label, icon, color }, index) => (
          <button
            key={label}
            onClick={() => searchJobHandler(label)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:border-purple-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: `${color}15` }}
            >
              {icon}
            </div>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700 transition-colors text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryCarousel;
