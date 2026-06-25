import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit2, MoreHorizontal, Plus, Globe, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies.jsx";

const CompaniesTable = () => {
  useGetAllCompanies();
  const { companies, searchCompanyByText, error } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) return true;
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  if (error || !filterCompany || filterCompany.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="text-5xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {searchCompanyByText ? `No results for "${searchCompanyByText}"` : "No Companies Registered"}
        </h3>
        <p className="text-gray-400 text-sm mb-5">
          Register a company to start posting jobs
        </p>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6a38c2, #7209b7)" }}
          onClick={() => navigate("/admin/companies/create")}
        >
          <Plus className="w-4 h-4" />
          Register Company
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption className="text-gray-400 pb-4">
          {filterCompany.length} compan{filterCompany.length !== 1 ? "ies" : "y"} registered
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-100">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Company
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Location
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Website
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Registered
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500 py-3">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.map((company) => (
            <TableRow
              key={company._id}
              className="border-b border-gray-50 hover:bg-purple-50 transition-colors duration-150"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-xl border border-gray-100">
                    <AvatarImage
                      src={company.logo}
                      className="object-contain p-1"
                    />
                    <AvatarFallback className="rounded-xl bg-purple-100 text-purple-700 text-sm font-bold">
                      {company.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {company.name}
                    </p>
                    {company.description && (
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">
                        {company.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {company.location || "—"}
                </div>
              </TableCell>
              <TableCell className="py-4">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-purple-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {company.website.replace(/https?:\/\//, "").slice(0, 20)}
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-500 py-4">
                {company.createdAt?.split("T")[0] || "—"}
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
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors w-full text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Company
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

export default CompaniesTable;
