import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import DeleteConfirmModal from "../../../components/Modal/DeleteConfirmModal";
import EditIssueModal from "../../../components/Modal/EditIssueModal";
import toast from "react-hot-toast";
import { getStatusColor, getPriorityColor, formatDate } from "../../../utils";
import { MdEdit, MdDelete, MdVisibility, MdFilterList } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";

const STATUSES = [
  "pending",
  "in-progress",
  "working",
  "resolved",
  "closed",
  "rejected",
];
const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
  "Other",
];

const MyIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["my-issues", user?.email, filterStatus, filterCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterCategory) params.set("category", filterCategory);
      const res = await axiosSecure(`/my-issues?${params.toString()}`);
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/issues/${id}`);
      toast.success("Issue deleted!");
      queryClient.invalidateQueries(["my-issues"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Issues</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {issues.length} issue{issues.length !== 1 ? "s" : ""} submitted
          </p>
        </div>
        <Link
          to="/dashboard/report-issue"
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl
            hover:bg-blue-700 transition text-center"
        >
          + Report New Issue
        </Link>
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
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-blue-400
            bg-gray-50 cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-blue-400
            bg-gray-50 cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(filterStatus || filterCategory) && (
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterCategory("");
            }}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {issues.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium">No issues found</p>
          <Link
            to="/dashboard/report-issue"
            className="inline-block mt-4 text-blue-600 hover:underline text-sm font-medium"
          >
            Submit your first issue →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "Image",
                    "Title",
                    "Category",
                    "Status",
                    "Priority",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Image */}
                    <td className="px-5 py-4">
                      <div className="relative w-12 h-12">
                        <img
                          src={issue.image}
                          alt={issue.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        {issue.isBoosted && (
                          <span className="absolute -top-1 -right-1">
                            <BsLightningChargeFill className="text-orange-500 text-xs" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-800 max-w-[180px] truncate">
                        {issue.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">
                        {issue.location}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs bg-blue-50 text-blue-600 font-semibold
                        px-2 py-0.5 rounded-full"
                      >
                        {issue.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize
                        ${getStatusColor(issue.status)}`}
                      >
                        {issue.status}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize
                        ${getPriorityColor(issue.priority)}`}
                      >
                        {issue.priority}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-400">
                        {formatDate(issue.createdAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <Link
                          to={`/issues/${issue._id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="View Details"
                        >
                          <MdVisibility className="text-lg" />
                        </Link>

                        {/* Edit – only pending */}
                        {issue.status === "pending" && (
                          <button
                            onClick={() => setEditTarget(issue)}
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                            title="Edit"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(issue._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        message="Are you sure you want to delete this issue? This cannot be undone."
      />

      {/* Edit Modal */}
      {editTarget && (
        <EditIssueModal
          isOpen={!!editTarget}
          onClose={() => setEditTarget(null)}
          issue={editTarget}
          onSuccess={() => {
            queryClient.invalidateQueries(["my-issues"]);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default MyIssues;
