import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#6b7280"];

const CitizenStatistics = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["citizen-stats"],
    queryFn: async () => {
      const res = await axiosSecure("/citizen/stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  const pieData = [
    { name: "Pending", value: stats.pending || 0 },
    { name: "In Progress", value: stats.inProgress || 0 },
    { name: "Resolved", value: stats.resolved || 0 },
    {
      name: "Others",
      value: Math.max(
        0,
        (stats.total || 0) -
          (stats.pending || 0) -
          (stats.inProgress || 0) -
          (stats.resolved || 0),
      ),
    },
  ];

  const statCards = [
    {
      label: "Total Issues",
      value: stats.total,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Pending",
      value: stats.pending,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Total Paid",
      value: `৳ ${stats.totalPaid || 0}`,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Issue Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CitizenStatistics;
