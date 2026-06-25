import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompaniesTable from "../../components/shared/CompaniesTable";
import { setSearchCompanyByText } from "../../store/companySlice";
import { useDispatch } from "react-redux";
import { Plus, Search, Building2 } from "lucide-react";

function CompaniesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-outfit">
                  My Companies
                </h1>
                <p className="text-sm text-gray-500">Manage your registered companies</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/companies/create")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                boxShadow: "0 4px 12px rgba(106,56,194,0.4)",
              }}
            >
              <Plus className="w-4 h-4" />
              Register Company
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-5 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search companies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
}

export default CompaniesPage;
