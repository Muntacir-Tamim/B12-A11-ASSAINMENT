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
} from "recharts";

const StaffStatistics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["staff-stats"],
    queryFn: async () => {
      const res = await axiosSecure("/staff/stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const chartData = [
    { name: "Assigned", count: stats.assigned || 0 },
    { name: "Resolved", count: stats.resolved || 0 },
    { name: "Closed", count: stats.closed || 0 },
    { name: "Today's", count: stats.todayTasks || 0 },
  ];

  const statCards = [
    {
      label: "Assigned Issues",
      value: stats.assigned,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Closed",
      value: stats.closed,
      color: "bg-gray-100 text-gray-700",
    },
    {
      label: "Today's Tasks",
      value: stats.todayTasks,
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Staff Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          My Work Overview
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffStatistics;
