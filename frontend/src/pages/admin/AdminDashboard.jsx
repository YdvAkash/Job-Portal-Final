import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "../../utils/const";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Briefcase, Users, CheckCircle, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/analytics`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Track your recruitment pipeline and job performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Jobs</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.totalJobs}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Applications</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.totalApplications}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Accepted</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {data.statusBreakdown.find((s) => s.name === "Accepted")?.value || 0}
            </h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {data.statusBreakdown.find((s) => s.name === "Pending")?.value || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Applications Over Time (Last 7 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#6a38c2"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6a38c2', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Application Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#374151' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
