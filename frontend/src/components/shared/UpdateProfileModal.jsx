import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User, Mail, Phone, FileText, Star, UploadCloud, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../../utils/const";
import { toast } from "sonner";
import { setUser } from "../../store/authSlice";

function UpdateProfileModal({ open, setOpen }) {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.profile?.bio || "",
      skills: user?.profile?.skills?.join(", ") || "",
      file: null,
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("bio", data.bio);
      formData.append("skills", data.skills);
      if (data.file && data.file[0]) {
        formData.append("file", data.file[0]);
      }

      const response = await axios.put(
        `${USER_API_END_POINT}/profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.data?.data) {
        dispatch(setUser(response.data.data));
        toast.success("Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const fields = [
    { label: "Full Name", key: "fullName", type: "text", icon: User, placeholder: "John Doe" },
    { label: "Email", key: "email", type: "email", icon: Mail, placeholder: "you@example.com" },
    { label: "Phone", key: "phoneNumber", type: "text", icon: Phone, placeholder: "+91 98765 43210" },
    { label: "Bio", key: "bio", type: "text", icon: FileText, placeholder: "Brief description about yourself" },
    { label: "Skills", key: "skills", type: "text", icon: Star, placeholder: "React, Node.js, Python..." },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-gray-100"
          style={{
            background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 font-outfit">
              Edit Profile
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              Update your personal information
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
          <div className="space-y-4">
            {fields.map(({ label, key, type, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-purple-500" />
                  {label}
                </label>
                <input
                  id={key}
                  type={type}
                  placeholder={placeholder}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors[key]
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  }`}
                  {...register(key)}
                />
                {key === "skills" && (
                  <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                )}
                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]?.message}</p>
                )}
              </div>
            ))}

            {/* Resume Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-purple-500" />
                Resume (PDF)
              </label>

              {selectedFileName ? (
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50">
                  <FileText className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm text-purple-700 flex-1 truncate">
                    {selectedFileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFileName(null);
                      setValue("file", null);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : user?.profile?.resumeOriginalName ? (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {user.profile.resumeOriginalName}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-purple-600 hover:text-purple-800"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 text-sm text-gray-500 hover:text-purple-700"
                >
                  <UploadCloud className="w-4 h-4" />
                  Click to upload resume
                </button>
              )}

              <input
                id="resume"
                type="file"
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFileName(file.name);
                    setValue("file", e.target.files);
                  }
                }}
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                boxShadow: "0 4px 12px rgba(106,56,194,0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProfileModal;
