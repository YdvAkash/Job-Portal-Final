import React, { useEffect } from "react";
import CategoryCarousel from "../components/shared/CategoryCarousel";
import LatestJob from "../components/shared/LatestJob";
import HeroSection from "../components/shared/HeroSection";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setHomeSearchJobByText } from "../store/jobSlice";

function Home() {
  const user = useSelector((store) => store.auth.user);
  const { allJobs, jobError } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useGetAllJobs();

  useEffect(() => {
    dispatch(setHomeSearchJobByText(""));
    if (user && user.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate, dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <CategoryCarousel />

      {/* Latest Jobs */}
      {isLoading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 skeleton rounded-lg w-56 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
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
        </section>
      ) : jobError ? (
        <section className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">{jobError}</p>
        </section>
      ) : (
        <LatestJob />
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f0a28 0%, #2d1065 50%, #6a38c2 100%)",
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-outfit">
              Ready to Find Your Dream Job?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of professionals who found their perfect career through JobPortal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/browse")}
                className="px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #F83002, #ff6b35)",
                  boxShadow: "0 8px 24px rgba(248,48,2,0.4)",
                }}
              >
                Browse Jobs Now
              </button>
              {!user && (
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 rounded-2xl font-bold text-lg text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  Create Free Account
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
