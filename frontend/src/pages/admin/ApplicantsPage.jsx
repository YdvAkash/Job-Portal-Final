import React from "react";
import ApplicantsTable from "../../components/shared/ApplicantsTable";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useGetApplicants from "../../hooks/useGetApplicants";
import { useSelector } from "react-redux";

function ApplicantsPage() {
  const navigate = useNavigate();
  const params = useParams();
  useGetApplicants(params.id);
  const { applicants } = useSelector((store) => store.application);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/jobs")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-outfit">Applicants</h1>
                  <p className="text-sm text-gray-500">
                    {applicants?.length
                      ? `${applicants.length} applicant${applicants.length !== 1 ? "s" : ""} found`
                      : "Review job applicants"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <ApplicantsTable />
        </div>
      </div>
    </div>
  );
}

export default ApplicantsPage;
