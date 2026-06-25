import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/const";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../store/authSlice.js";
import { Loader2, Briefcase, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: "applicant" } });

  const onSubmit = async (data) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        if (res.data.user?.role === "recruiter") {
          navigate("/admin/companies");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      if (error.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0a28 0%, #2d1065 50%, #6a38c2 100%)",
        }}
      >
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Orbs */}
        <div
          className="absolute w-80 h-80 rounded-full"
          style={{
            top: "-10%",
            right: "-10%",
            background: "radial-gradient(circle, #7209b7, transparent)",
            opacity: 0.3,
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full"
          style={{
            bottom: "10%",
            left: "-5%",
            background: "radial-gradient(circle, #F83002, transparent)",
            opacity: 0.2,
            filter: "blur(60px)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-outfit">
            Job<span className="text-purple-300">Portal</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4 font-outfit">
            Your Next Big Career Move Starts Here
          </h2>
          <p className="text-white/60 text-lg">
            Connect with top employers and find opportunities that match your skills.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: "10K+", label: "Jobs" },
              { value: "500+", label: "Companies" },
              { value: "50K+", label: "Hired" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-white/50 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/30 text-xs">
          © 2025 JobPortal. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
            >
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-outfit">
              Job<span className="text-purple-700">Portal</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-outfit">Welcome back 👋</h1>
            <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Toggle */}
            <div className="flex p-1 rounded-xl bg-gray-100 gap-1">
              {["applicant", "recruiter"].map((role) => (
                <label key={role} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value={role}
                    {...register("role", { required: true })}
                    className="sr-only"
                  />
                  <div
                    className={`text-center py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                      true
                        ? ""
                        : ""
                    }`}
                    style={{
                      // We use CSS :has for this, but for React we'll handle via state
                    }}
                  >
                    {role === "applicant" ? "🧑‍💼 Job Seeker" : "🏢 Recruiter"}
                  </div>
                </label>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Role Selector — visual pills */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Login as</p>
              <div className="flex gap-3">
                {["applicant", "recruiter"].map((role) => (
                  <label key={role} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      value={role}
                      {...register("role")}
                      className="sr-only peer"
                    />
                    <div className="py-2.5 rounded-xl border-2 text-sm font-semibold capitalize text-center text-gray-600 border-gray-200 peer-checked:border-purple-600 peer-checked:bg-purple-50 peer-checked:text-purple-700 transition-all duration-200 hover:border-purple-300">
                      {role}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                boxShadow: "0 4px 16px rgba(106,56,194,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-purple-700 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
