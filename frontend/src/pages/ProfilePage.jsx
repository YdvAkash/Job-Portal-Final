import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Pen,
  Phone,
  UploadCloud,
  FileText,
  Star,
  Plus,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import AppliedJobTable from "../components/shared/AppliedJobTable";
import UpdateProfileModal from "../components/shared/UpdateProfileModal";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../store/authSlice";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../utils/const";

function ProfilePage() {
  const [open, setOpen] = useState(false);
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
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
        toast.success("Resume updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update resume. Please try again.");
    }
  };

  // Safe URL for viewing resume inline
  const resumeUrl = user?.profile?.resume
    ? `${user.profile.resume}?fl_attachment=false`
    : null;

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div
        className="h-40 sm:h-52 relative"
        style={{
          background:
            "linear-gradient(135deg, #0f0a28 0%, #2d1065 50%, #6a38c2 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="px-6 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white shadow-xl">
                  <AvatarImage
                    src={user?.profile?.profileImage}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className="text-2xl font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, #6a38c2, #7209b7)",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 sm:pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {user.fullName}
                    </h1>
                    <p className="text-gray-500 mt-0.5">
                      {user?.profile?.bio || "No bio added yet"}
                    </p>
                  </div>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 rounded-xl border-gray-200 hover:border-purple-300 hover:text-purple-700 self-start sm:self-auto"
                  >
                    <Pen className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <span>{user.phoneNumber || "No phone number"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-green-600" />
                </div>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Resume Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Skills Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <h2 className="font-bold text-gray-900">Skills</h2>
              </div>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skills
              </button>
            </div>

            {user?.profile?.skills && user.profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-xl text-sm font-medium border transition-all"
                    style={{
                      background: "rgba(106,56,194,0.06)",
                      borderColor: "rgba(106,56,194,0.2)",
                      color: "#6a38c2",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="text-3xl mb-2">🔧</div>
                <p className="text-sm text-gray-500">No skills added yet</p>
                <button
                  onClick={() => setOpen(true)}
                  className="mt-2 text-sm font-medium text-purple-600 hover:underline"
                >
                  Add your skills
                </button>
              </div>
            )}
          </div>

          {/* Resume Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-bold text-gray-900">Resume</h2>
            </div>

            {resumeUrl ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user?.profile?.resumeOriginalName || "Resume.pdf"}
                    </p>
                    <p className="text-xs text-gray-400">PDF Document</p>
                  </div>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                </div>
                {/* Also allow re-upload */}
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-2 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:border-purple-300 hover:text-purple-600 transition-all">
                    <UploadCloud className="w-4 h-4" />
                    Replace resume
                  </div>
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                  <UploadCloud className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  No resume uploaded
                </p>
                <p className="text-xs text-gray-400 mb-3">PDF format, max 5MB</p>
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #6a38c2, #7209b7)",
                    }}
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload Resume
                  </div>
                </label>
              </div>
            )}

            <input
              type="file"
              accept=".pdf"
              id="resume-upload"
              className="hidden"
              onChange={handleResumeUpload}
            />
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Applied Jobs</h2>
          </div>
          <AppliedJobTable />
        </div>
      </div>

      <UpdateProfileModal open={open} setOpen={setOpen} />
    </div>
  );
}

export default ProfilePage;
