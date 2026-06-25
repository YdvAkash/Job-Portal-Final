import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { MoreHorizontal, Download, Mail, Phone, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { APPLICATION_API_END_POINT } from "../../utils/const";
import axios from "axios";
import { setApplicants } from "../../store/applicationSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function ApplicantsTable() {
  const dispatch = useDispatch();
  const { applicants, error } = useSelector((store) => store.application);

  const statusHandler = async (status, applicationId) => {
    try {
      // Optimistic update
      dispatch(
        setApplicants(
          applicants.map((app) =>
            app.applicationId === applicationId
              ? { ...app, status: status.toLowerCase() }
              : app
          )
        )
      );
      const res = await axios.put(
        `${APPLICATION_API_END_POINT}/status/${applicationId}`,
        { status },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred.");
      console.error("Error updating status:", error);
    }
  };

  const statusConfig = {
    accepted: {
      cls: "bg-green-50 text-green-700 border border-green-200",
      dot: "bg-green-500",
      label: "Accepted",
    },
    rejected: {
      cls: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
      label: "Rejected",
    },
    pending: {
      cls: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      dot: "bg-yellow-400",
      label: "Pending",
    },
  };

  if (error || !applicants || applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="text-5xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applicants Yet</h3>
        <p className="text-gray-400 text-sm mb-5">
          {error || "When candidates apply, they will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-400 pb-4">
          {applicants.length} applicant{applicants.length !== 1 ? "s" : ""} found
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-100">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Candidate
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Contact Info
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Resume
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Applied Date
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Status
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map(({ applicationId, applicant, status }) => {
            const currentStatus = status?.toLowerCase() || "pending";
            const cfg = statusConfig[currentStatus] || statusConfig.pending;
            
            return (
              <TableRow
                key={applicationId}
                className="border-b border-gray-50 hover:bg-purple-50 transition-colors duration-150"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-xl">
                      <AvatarImage src={applicant?.profile?.profileImage} />
                      <AvatarFallback className="rounded-xl bg-purple-100 text-purple-700 font-bold">
                        {applicant?.fullName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {applicant?.fullName}
                      </p>
                      {applicant?.profile?.skills?.length > 0 && (
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {applicant.profile.skills.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {applicant?.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {applicant?.phoneNumber || "N/A"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {applicant?.profile?.resume ? (
                    <a
                      href={applicant.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Resume
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No Resume</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500 py-4">
                  {new Date(applicant?.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.cls}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 rounded-xl shadow-xl border border-gray-100" align="end">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 px-2 py-1 uppercase tracking-wider">
                          Update Status
                        </p>
                        <button
                          onClick={() => statusHandler("Accepted", applicationId)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors w-full text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Accept
                        </button>
                        <button
                          onClick={() => statusHandler("Rejected", applicationId)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors w-full text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                          Reject
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ApplicantsTable;
