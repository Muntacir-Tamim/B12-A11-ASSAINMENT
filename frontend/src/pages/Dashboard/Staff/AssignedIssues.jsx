import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import toast from "react-hot-toast";
import { getStatusColor, getPriorityColor, formatDate } from "../../../utils";
import { MdVisibility, MdFilterList } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";

// Valid transitions staff can make
const TRANSITIONS = {
  pending: ["in-progress"],
  "in-progress": ["working"],
  working: ["resolved"],
  resolved: ["closed"],
};

const STATUSES = ["pending", "in-progress", "working", "resolved", "closed"];
const PRIORITIES = ["normal", "high"];

const AssignedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [updating, setUpdating] = useState(null);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["assigned-issues", user?.email, filterStatus, filterPriority],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterPriority) params.set("priority", filterPriority);
      const res = await axiosSecure(`/staff/issues?${params.toString()}`);
      return res.data;
    },
  });

  const handleStatusChange = async (issueId, newStatus) => {
    setUpdating(issueId);
    try {
      await axiosSecure.patch(`/staff/issues/${issueId}/status`, {
        status: newStatus,
      });
      toast.success(`Status updated to "${newStatus}"`);
      queryClient.invalidateQueries(["assigned-issues"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Status update failed");
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Assigned Issues</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {issues.length} issue{issues.length !== 1 ? "s" : ""} assigned to you
        </p>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6
        flex flex-wrap items-center gap-3"
      >
        <MdFilterList className="text-gray-500 text-xl" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm
            focus:outline-blue-400 bg-gray-50 cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm
            focus:outline-blue-400 bg-gray-50 cursor-pointer"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p} className="capitalize">
              {p}
            </option>
          ))}
        </select>
        {(filterStatus || filterPriority) && (
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterPriority("");
            }}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">No issues assigned to you yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "Issue",
                    "Category",
                    "Status",
                    "Priority",
                    "Citizen",
                    "Date",
                    "Change Status",
                    "View",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => {
                  const nextStatuses = TRANSITIONS[issue.status] || [];
                  const isUpdating = updating === issue._id;

                  return (
                    <tr
                      key={issue._id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition
                        ${issue.isBoosted ? "bg-orange-50/40" : ""}`}
                    >
                      {/* Issue */}
                      <td className="px-4 py-4 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          {issue.isBoosted && (
                            <BsLightningChargeFill
                              className="text-orange-500 flex-shrink-0"
                              title="Boosted"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800 max-w-[160px] truncate">
                              {issue.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[160px]">
                              {issue.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span
                          className="text-xs bg-blue-50 text-blue-600 font-semibold
                          px-2 py-0.5 rounded-full whitespace-nowrap"
                        >
                          {issue.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize
                          whitespace-nowrap ${getStatusColor(issue.status)}`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize
                          ${getPriorityColor(issue.priority)}`}
                        >
                          {issue.priority}
                        </span>
                      </td>

                      {/* Citizen */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-600 max-w-[130px] truncate">
                          {issue.citizen?.name}
                        </p>
                        <p className="text-xs text-gray-400 max-w-[130px] truncate">
                          {issue.citizen?.email}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(issue.createdAt)}
                        </p>
                      </td>

                      {/* Change Status */}
                      <td className="px-4 py-4">
                        {nextStatuses.length > 0 ? (
                          <select
                            defaultValue=""
                            disabled={isUpdating}
                            onChange={(e) => {
                              if (e.target.value)
                                handleStatusChange(issue._id, e.target.value);
                            }}
                            className="border-2 border-blue-200 focus:outline-blue-400
                              rounded-lg px-2 py-1.5 text-xs bg-white cursor-pointer
                              disabled:opacity-60 min-w-[130px]"
                          >
                            <option value="">Update status...</option>
                            {nextStatuses.map((s) => (
                              <option key={s} value={s} className="capitalize">
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No further action
                          </span>
                        )}
                      </td>

                      {/* View */}
                      <td className="px-4 py-4">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50
                            transition inline-flex"
                          title="View Details"
                        >
                          <MdVisibility className="text-lg" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
