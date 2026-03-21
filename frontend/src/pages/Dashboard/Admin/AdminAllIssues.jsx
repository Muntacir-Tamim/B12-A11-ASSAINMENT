import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AssignStaffModal from "../../../components/Modal/AssignStaffModal";
import DeleteConfirmModal from "../../../components/Modal/DeleteConfirmModal";
import toast from "react-hot-toast";
import { getStatusColor, getPriorityColor, formatDate } from "../../../utils";
import {
  MdVisibility,
  MdFilterList,
  MdPersonAdd,
  MdCancel,
} from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";

const STATUSES = [
  "pending",
  "in-progress",
  "working",
  "resolved",
  "closed",
  "rejected",
];
const PRIORITIES = ["normal", "high"];
const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
  "Other",
];

const AdminAllIssues = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [assignTarget, setAssignTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["admin-issues", filterStatus, filterPriority, filterCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterPriority) params.set("priority", filterPriority);
      if (filterCategory) params.set("category", filterCategory);
      const res = await axiosSecure(`/admin/issues?${params.toString()}`);
      return res.data;
    },
  });

  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`/admin/issues/${id}/reject`);
      toast.success("Issue rejected");
      queryClient.invalidateQueries(["admin-issues"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reject failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Issues</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {issues.length} total issue{issues.length !== 1 ? "s" : ""}
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
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm
            focus:outline-blue-400 bg-gray-50 cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(filterStatus || filterPriority || filterCategory) && (
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterPriority("");
              setFilterCategory("");
            }}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📂</p>
          <p className="text-lg font-medium">No issues found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "Title",
                    "Category",
                    "Status",
                    "Priority",
                    "Assigned Staff",
                    "Citizen",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500
                        uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr
                    key={issue._id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition
                      ${issue.isBoosted ? "bg-orange-50/30" : ""}`}
                  >
                    {/* Title */}
                    <td className="px-4 py-4 min-w-[180px]">
                      <div className="flex items-center gap-1.5">
                        {issue.isBoosted && (
                          <BsLightningChargeFill className="text-orange-500 flex-shrink-0 text-sm" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800 max-w-[160px] truncate">
                            {issue.title}
                          </p>
                          <p className="text-xs text-gray-400 max-w-[160px] truncate">
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

                    {/* Assigned Staff */}
                    <td className="px-4 py-4 min-w-[160px]">
                      {issue.assignedStaff ? (
                        <div className="flex items-center gap-2">
                          {issue.assignedStaff.image && (
                            <img
                              src={issue.assignedStaff.image}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          <p className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                            {issue.assignedStaff.name}
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssignTarget(issue)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600
                            bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition
                            whitespace-nowrap cursor-pointer"
                        >
                          <MdPersonAdd /> Assign Staff
                        </button>
                      )}
                    </td>

                    {/* Citizen */}
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-600 max-w-[120px] truncate">
                        {issue.citizen?.name}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(issue.createdAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="View"
                        >
                          <MdVisibility className="text-lg" />
                        </Link>
                        {issue.status === "pending" && (
                          <button
                            onClick={() => setRejectTarget(issue._id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                            title="Reject Issue"
                          >
                            <MdCancel className="text-lg" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Staff Modal */}
      {assignTarget && (
        <AssignStaffModal
          isOpen={!!assignTarget}
          onClose={() => setAssignTarget(null)}
          issue={assignTarget}
          onSuccess={() => queryClient.invalidateQueries(["admin-issues"])}
        />
      )}

      {/* Reject Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => handleReject(rejectTarget)}
        message="Are you sure you want to reject this issue? A timeline entry will be recorded."
      />
    </div>
  );
};

export default AdminAllIssues;
