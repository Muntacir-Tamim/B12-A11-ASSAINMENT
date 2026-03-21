import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatDate } from "../../../utils";

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const chartData = [
    { name: "Pending", count: stats.pendingIssues || 0 },
    { name: "Resolved", count: stats.resolvedIssues || 0 },
    { name: "Rejected", count: stats.rejectedIssues || 0 },
    { name: "Closed", count: stats.closedIssues || 0 },
  ];

  const statCards = [
    {
      label: "Total Issues",
      value: stats.totalIssues,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Pending",
      value: stats.pendingIssues,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Resolved",
      value: stats.resolvedIssues,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Rejected",
      value: stats.rejectedIssues,
      color: "bg-red-100 text-red-700",
    },
    {
      label: "Closed",
      value: stats.closedIssues,
      color: "bg-gray-100 text-gray-700",
    },
    {
      label: "Total Revenue",
      value: `৳ ${stats.totalRevenue || 0}`,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl p-4 ${card.color} shadow-sm`}
          >
            <p className="text-2xl font-bold">{card.value ?? 0}</p>
            <p className="text-sm font-medium mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Issue Status Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Latest rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Issues */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Latest Issues</h3>
          <ul className="space-y-2">
            {stats.latestIssues?.map((issue) => (
              <li key={issue._id} className="text-sm border-b pb-2">
                <p className="font-medium truncate">{issue.title}</p>
                <p className="text-gray-400 text-xs">
                  {formatDate(issue.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Latest Payments */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Latest Payments</h3>
          <ul className="space-y-2">
            {stats.latestPayments?.map((p) => (
              <li key={p._id} className="text-sm border-b pb-2">
                <p className="font-medium">{p.citizenName}</p>
                <p className="text-gray-400 text-xs">
                  ৳ {p.amount} – {p.type}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Latest Users */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Latest Citizens</h3>
          <ul className="space-y-2">
            {stats.latestUsers?.map((u) => (
              <li key={u._id} className="flex items-center gap-2 border-b pb-2">
                {u.image && (
                  <img
                    src={u.image}
                    className="w-7 h-7 rounded-full object-cover"
                    alt=""
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
