import React from "react";
import { Badge } from "@/components/ui/badge";
import useGetAppliedJobs from "../../hooks/useGetAppliedJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, ExternalLink, Briefcase } from "lucide-react";

export default function AppliedJobTable() {
  useGetAppliedJobs();
  const { appliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

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

  if (!appliedJobs || appliedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-purple-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No applications yet</h3>
        <p className="text-sm text-gray-400 mb-4">
          Start applying to jobs to track them here
        </p>
        <button
          onClick={() => navigate("/jobs")}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
        >
          Browse Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-400 pb-4">
          {appliedJobs.length} job{appliedJobs.length !== 1 ? "s" : ""} applied
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-100">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Date Applied
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Job Title
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Company
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Type
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appliedJobs.map((appliedJob, index) => {
            const status = appliedJob?.status || "pending";
            const cfg = statusConfig[status] || statusConfig.pending;
            return (
              <TableRow
                key={appliedJob?.job?._id || index}
                className="border-b border-gray-50 hover:bg-purple-50 transition-colors duration-150"
              >
                <TableCell className="text-sm text-gray-500 py-4">
                  {appliedJob?.job?.createdAt
                    ? new Date(appliedJob.job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-semibold text-gray-900 text-sm">
                    {appliedJob?.job?.title || "—"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {appliedJob?.job?.location || "India"}
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-800 py-4">
                  {appliedJob?.job?.company?.name || "—"}
                </TableCell>
                <TableCell className="py-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {appliedJob?.job?.jobType || "—"}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.cls}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <button
                    onClick={() => navigate(`/description/${appliedJob?.job?._id}`)}
                    className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    View
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
