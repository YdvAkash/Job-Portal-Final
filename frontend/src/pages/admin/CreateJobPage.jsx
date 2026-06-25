import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/const.js";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Briefcase, MapPin, DollarSign, FileText, CheckCircle, Trash2 } from "lucide-react";
import useGetCompanies from "../../hooks/useGetAllCompanies.jsx";

const PostJob = () => {
  const params = useParams();
  const jobId = params.id;
  const isEditMode = !!jobId;

  useGetCompanies();
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  useEffect(() => {
    const fetchJobData = async () => {
      if (jobId) {
        try {
          setFetchLoading(true);
          const response = await axios.get(`${JOB_API_END_POINT}/${jobId}`, {
            withCredentials: true,
          });

          if (response.data.success) {
            const jobData = response.data.job;
            setInput({
              title: jobData.title || "",
              description: jobData.description || "",
              requirements: Array.isArray(jobData.requirements)
                ? jobData.requirements.join(", ")
                : jobData.requirements || "",
              salary: jobData.salary || "",
              location: jobData.location || "",
              jobType: jobData.jobType || "",
              experience: jobData.experience || "",
              position: jobData.position || 0,
              companyId: jobData.company._id || jobData.company || "",
            });
          }
        } catch (error) {
          toast.error("Failed to fetch job details");
        } finally {
          setFetchLoading(false);
        }
      }
    };
    fetchJobData();
  }, [jobId]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.companyId) {
      toast.error("Please select a company");
      return;
    }

    try {
      setLoading(true);
      const jobData = {
        title: input.title,
        description: input.description,
        requirements: input.requirements,
        salary: Number(input.salary),
        location: input.location,
        jobType: input.jobType,
        experience: input.experience,
        position: Number(input.position),
        company: input.companyId,
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `${JOB_API_END_POINT}/update/${jobId}`,
          jobData,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(`${JOB_API_END_POINT}/create`, jobData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      if (response.data.success) {
        toast.success(isEditMode ? "Job updated successfully" : "Job posted successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || (isEditMode ? "Failed to update job" : "Failed to post job"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    setShowDeleteModal(false);
    try {
      setLoading(true);
      const res = await axios.delete(`${JOB_API_END_POINT}/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Job deleted successfully");
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/jobs")}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
                >
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-outfit">
                    {isEditMode ? "Update Job" : "Post a New Job"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isEditMode ? "Modify existing job details" : "Create a new job listing for your company"}
                  </p>
                </div>
              </div>
            </div>
            
            {isEditMode && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Job
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        {companies.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Companies Found</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You need to register a company before you can post a job. Please create a company profile first.
            </p>
            <button
              onClick={() => navigate("/admin/companies/create")}
              className="px-6 py-3 rounded-xl text-white font-semibold"
              style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
            >
              Register Company
            </button>
          </div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Senior React Developer"
                    value={input.title}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                {/* Company Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Company <span className="text-red-500">*</span></label>
                  <select
                    name="companyId"
                    required
                    value={input.companyId}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-500" /> Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    placeholder="Describe the role, responsibilities, and ideal candidate..."
                    rows={4}
                    value={input.description}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all resize-y"
                  />
                </div>

                {/* Requirements */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Requirements <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="requirements"
                    required
                    placeholder="React, Node.js, MongoDB (comma separated)"
                    value={input.requirements}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                {/* Salary */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-green-500" /> Salary (LPA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="salary"
                    required
                    placeholder="e.g. 12"
                    min="0"
                    step="0.1"
                    value={input.salary}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" /> Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Bangalore, India"
                    value={input.location}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Job Type <span className="text-red-500">*</span></label>
                  <select
                    name="jobType"
                    required
                    value={input.jobType}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select job type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Experience (Years) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="experience"
                    required
                    placeholder="e.g. 2"
                    min="0"
                    value={input.experience}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                  />
                </div>

                {/* Positions */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">No. of Positions <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="position"
                    required
                    placeholder="e.g. 5"
                    min="1"
                    value={input.position}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/admin/jobs")}
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                    boxShadow: "0 4px 16px rgba(106,56,194,0.35)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      {isEditMode ? "Update Job" : "Post Job"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full relative z-10 animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Job</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this job? This action cannot be undone and will remove all applications.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;
