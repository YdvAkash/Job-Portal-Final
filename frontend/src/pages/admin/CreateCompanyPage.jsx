import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../utils/const.js";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../store/companySlice.js";
import { Building2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { name: companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success("Company registered! Now set it up.");
        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Back button */}
        <button
          onClick={() => navigate("/admin/companies")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Companies
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
            }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit">
              Register Your Company
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              What would you like to name your company? You can update details later.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="space-y-2 mb-6">
              <label className="text-sm font-semibold text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Microsoft, TechStartup..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && registerNewCompany()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all"
              />
              <p className="text-xs text-gray-400">
                This name will be visible to job seekers
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/companies")}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={registerNewCompany}
                disabled={loading || !companyName.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                  boxShadow: "0 4px 12px rgba(106,56,194,0.4)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
