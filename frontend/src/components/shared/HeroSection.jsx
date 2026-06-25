import React, { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, MapPin, Users, Briefcase, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { setHomeSearchJobByText } from "../../store/jobSlice";
import { useNavigate } from "react-router-dom";

const categories = [
  "React Developer",
  "Node.js",
  "Python",
  "UI/UX Designer",
  "Data Analyst",
  "DevOps",
  "Full Stack",
  "Machine Learning",
];

const stats = [
  { value: "10K+", label: "Active Jobs", icon: Briefcase, color: "#6a38c2" },
  { value: "500+", label: "Companies", icon: Building, color: "#7209b7" },
  { value: "50K+", label: "Job Seekers", icon: Users, color: "#F83002" },
  { value: "95%", label: "Success Rate", icon: TrendingUp, color: "#059669" },
];

function Building({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  );
}

function HeroSection() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [counters, setCounters] = useState({ jobs: 0, companies: 0, seekers: 0, rate: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Animate counters on mount
  useEffect(() => {
    const targets = { jobs: 10, companies: 500, seekers: 50, rate: 95 };
    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounters({
        jobs: Math.round(targets.jobs * eased),
        companies: Math.round(targets.companies * eased),
        seekers: Math.round(targets.seekers * eased),
        rate: Math.round(targets.rate * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const searchJobHandler = (e) => {
    e.preventDefault();
    dispatch(setHomeSearchJobByText(query || activeCategory));
    navigate("/browse");
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setQuery(cat);
    dispatch(setHomeSearchJobByText(cat));
    navigate("/browse");
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0f0a28 0%, #1a0b3e 25%, #2d1065 55%, #1a0b3e 80%, #0f0a28 100%)",
        }}
      />

      {/* Animated orbs */}
      <div
        className="hero-orb w-96 h-96 stagger-1"
        style={{
          top: "-10%",
          left: "-5%",
          background: "radial-gradient(circle, #6a38c2, transparent)",
          opacity: 0.2,
          animationDuration: "7s",
        }}
      />
      <div
        className="hero-orb w-80 h-80 stagger-3"
        style={{
          bottom: "5%",
          right: "-5%",
          background: "radial-gradient(circle, #7209b7, transparent)",
          opacity: 0.2,
          animationDuration: "9s",
        }}
      />
      <div
        className="hero-orb w-64 h-64 stagger-2"
        style={{
          top: "30%",
          right: "20%",
          background: "radial-gradient(circle, #F83002, transparent)",
          opacity: 0.1,
          animationDuration: "11s",
        }}
      />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>India's #1 Job Search Platform</span>
            <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
          </div>

          {/* Headline */}
          <h1
            className="font-bold text-white mb-6 animate-fade-in-up stagger-1"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
            }}
          >
            Search, Apply &{" "}
            <span className="relative">
              <span
                style={{
                  background: "linear-gradient(135deg, #a855f7, #7c3aed, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Get Hired
              </span>
            </span>
            <br />
            <span className="text-white/80 text-3xl sm:text-4xl lg:text-5xl font-medium">
              Find Your Dream Career
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2"
            style={{ lineHeight: "1.6" }}
          >
            Discover thousands of job opportunities from top companies. 
            Your next career move starts here.
          </p>

          {/* Search Bar */}
          <div className="animate-fade-in-up stagger-3 max-w-2xl mx-auto mb-6">
            <form
              onSubmit={searchJobHandler}
              className={`flex items-center gap-2 p-2 rounded-2xl transition-all duration-300 ${
                isSearchFocused
                  ? "bg-white shadow-2xl shadow-purple-500/30 ring-2 ring-purple-400"
                  : "bg-white/95 shadow-xl shadow-black/30"
              }`}
            >
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Job title, skills, or keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="flex-1 py-2 text-gray-800 placeholder-gray-400 outline-none bg-transparent text-base"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                  boxShadow: "0 4px 16px rgba(106,56,194,0.5)",
                }}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search Jobs</span>
              </button>
            </form>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in-up stagger-4">
            <span className="text-white/50 text-sm flex items-center gap-1 mr-2">
              <TrendingUp className="w-4 h-4" /> Trending:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                  activeCategory === cat
                    ? "bg-white text-purple-700 shadow-lg"
                    : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in-up stagger-5">
            {[
              { label: "Active Jobs", value: `${counters.jobs}K+`, icon: Briefcase, color: "#a855f7" },
              { label: "Companies", value: `${counters.companies}+`, icon: Building, color: "#7c3aed" },
              { label: "Job Seekers", value: `${counters.seekers}K+`, icon: Users, color: "#6366f1" },
              { label: "Success Rate", value: `${counters.rate}%`, icon: TrendingUp, color: "#10b981" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-2xl font-bold text-white font-outfit">{value}</span>
                <span className="text-white/50 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}

export default HeroSection;
