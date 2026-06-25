import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Building2, Globe, MapPin, FileText, Image, Save } from "lucide-react";
import axios from "axios";
import { COMPANY_API_END_POINT } from "../../utils/const.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "../../hooks/useGetCompanyById.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success("Company updated successfully!");
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating company");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
      setLogoPreview(singleCompany.logo || null);
    }
  }, [singleCompany]);

  const fields = [
    { label: "Company Name", name: "name", type: "text", icon: Building2, placeholder: "e.g. Google Inc." },
    { label: "Description", name: "description", type: "text", icon: FileText, placeholder: "Brief company description" },
    { label: "Website", name: "website", type: "url", icon: Globe, placeholder: "https://company.com" },
    { label: "Location", name: "location", type: "text", icon: MapPin, placeholder: "e.g. Bangalore, India" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/companies")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
              >
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-outfit">Company Setup</h1>
                <p className="text-xs text-gray-500">
                  {singleCompany?.name || "Update company details"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={submitHandler}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Upload Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">Company Logo</h3>
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200">
                    <AvatarImage
                      src={logoPreview}
                      className="object-contain p-1"
                    />
                    <AvatarFallback className="rounded-2xl bg-purple-50 text-purple-700 text-3xl font-bold">
                      {input.name?.charAt(0)?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-sm text-gray-600 hover:text-purple-700">
                    <Image className="w-4 h-4" />
                    {logoPreview ? "Change Logo" : "Upload Logo"}
                  </div>
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            {/* Fields Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-5 text-sm">Company Information</h3>
                <div className="space-y-4">
                  {fields.map(({ label, name, type, icon: Icon, placeholder }) => (
                    <div key={name}>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-purple-500" />
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={input[name]}
                        onChange={changeEventHandler}
                        placeholder={placeholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/companies")}
              className="px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                boxShadow: "0 4px 12px rgba(106,56,194,0.4)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
