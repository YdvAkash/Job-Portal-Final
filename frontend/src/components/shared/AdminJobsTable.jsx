import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit2, Eye, MoreHorizontal, Plus, AlertCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAdminJobs from "../../hooks/useGetAdminJobs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AdminJobsTable = () => {
  useGetAdminJobs();
  const { allAdminJobs, searchJobByText, jobError } = useSelector(
    (store) => store.job
  );
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    if (!allAdminJobs) {
      setFilterJobs([]);
      return;
    }
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  if (jobError) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Jobs Yet</h3>
        <p className="text-gray-400 text-sm mb-5">{jobError}</p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
          onClick={() => navigate("/admin/job/create")}
        >
          <Plus className="w-4 h-4" />
          Post Your First Job
        </button>
      </div>
    );
  }

  if (!filterJobs || filterJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Jobs Found</h3>
        <p className="text-gray-400 text-sm mb-5">
          {searchJobByText
            ? `No jobs match "${searchJobByText}"`
            : "You haven't posted any jobs yet"}
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
          onClick={() => navigate("/admin/job/create")}
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-400 pb-4">
          {filterJobs.length} job{filterJobs.length !== 1 ? "s" : ""} listed
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-100">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Company
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Job Role
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Type
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Posted
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Applicants
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.map((job) => (
            <TableRow
              key={job._id}
              className="border-b border-gray-50 hover:bg-purple-50 transition-colors duration-150"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 rounded-xl">
                    <AvatarImage
                      src={job?.company?.logo}
                      className="object-contain p-0.5"
                    />
                    <AvatarFallback className="rounded-xl bg-purple-100 text-purple-700 text-xs font-bold">
                      {job?.company?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900 text-sm">
                    {job?.company?.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <span className="font-semibold text-gray-900 text-sm">
                  {job?.title}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {job?.jobType || "—"}
                </span>
              </TableCell>
              <TableCell className="text-sm text-gray-500 py-4">
                {job?.createdAt?.split("T")[0] || "—"}
              </TableCell>
              <TableCell className="py-4">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700">
                  {job?.applications?.length || 0}
                </span>
              </TableCell>
              <TableCell className="text-right py-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-2 rounded-xl shadow-xl border border-gray-100">
                    <button
                      onClick={() => navigate(`/admin/job/edit/${job._id}`)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors w-full text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Job
                    </button>
                    <button
                      onClick={() => navigate(`/admin/job/${job._id}/applicants`)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors w-full text-sm font-medium mt-1"
                    >
                      <Eye className="w-4 h-4" />
                      Applicants ({job?.applications?.length || 0})
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
