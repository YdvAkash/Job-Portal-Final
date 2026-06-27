import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/const";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Briefcase, Mail, Lock, User, Phone, Eye, EyeOff, Camera } from "lucide-react";
import { setLoading } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: "applicant" } });

  const role = watch("role");

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.phoneNumber) {
      const phone = parseInt(data.phoneNumber.trim(), 10);
      if (!isNaN(phone)) data.phoneNumber = phone;
    }

    Object.keys(data).forEach((key) => {
      if (key === "profileImage") {
        if (data[key]?.[0]) formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key] || "");
      }
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Account created! Please check your email to verify your account.");
        navigate("/login");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map((e) => e.message).join(", ");
        toast.error(messages);
      } else {
        toast.error(err.response?.data?.message || "Registration failed. Please try again.");
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
            "linear-gradient(135deg, #0f0a28 0%, #1a0b3e 30%, #6a38c2 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full"
          style={{
            top: "-10%",
            right: "-10%",
            background: "radial-gradient(circle, #F83002, transparent)",
            opacity: 0.2,
            filter: "blur(60px)",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white font-outfit">
            Job<span className="text-purple-300">Portal</span>
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4 font-outfit">
            Join Thousands of <span className="text-purple-300">Successful</span> Professionals
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Create your account and get discovered by top companies.
          </p>

          {[
            "✅ Free to join, no hidden fees",
            "✅ Instant job alerts via email",
            "✅ Direct apply with one click",
            "✅ AI-powered job matching",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 mb-3">
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-white/30 text-xs">
          © 2025 JobPortal. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
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

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 font-outfit">Create account 🚀</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-gray-300" />
                  )}
                </div>
                <label
                  htmlFor="profileImage"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center cursor-pointer hover:bg-purple-700"
                >
                  <Camera className="w-3 h-3 text-white" />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Profile Photo</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
              </div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                {...register("profileImage")}
                onChange={(e) => {
                  handleImagePreview(e);
                  register("profileImage").onChange(e);
                }}
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors.fullName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                  {...register("fullName", { required: "Full Name is required" })}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs">{errors.fullName.message}</p>
              )}
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

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors.phoneNumber
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                  {...register("phoneNumber", { required: "Phone is required" })}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
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

            {/* Role Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">I'm a</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "applicant", label: "Job Seeker", icon: "🧑‍💼", desc: "Looking for jobs" },
                  { value: "recruiter", label: "Recruiter", icon: "🏢", desc: "Hiring talent" },
                ].map(({ value, label, icon, desc }) => (
                  <label key={value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={value}
                      {...register("role", { required: true })}
                      className="sr-only peer"
                    />
                    <div className="p-3 rounded-xl border-2 border-gray-200 peer-checked:border-purple-600 peer-checked:bg-purple-50 transition-all duration-200 hover:border-purple-300">
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="text-sm font-semibold text-gray-800 peer-checked:text-purple-700">
                        {label}
                      </div>
                      <div className="text-xs text-gray-400">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                boxShadow: "0 4px 16px rgba(106,56,194,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
