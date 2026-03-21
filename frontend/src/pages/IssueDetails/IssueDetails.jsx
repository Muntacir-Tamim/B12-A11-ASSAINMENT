import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import Container from "../../components/Shared/Container";
import toast from "react-hot-toast";
import {
  MdLocationOn,
  MdOutlineThumbUp,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { getStatusColor, getPriorityColor, formatDate } from "../../utils";
import EditIssueModal from "../../components/Modal/EditIssueModal";
import DeleteConfirmModal from "../../components/Modal/DeleteConfirmModal";

const IssueDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Fetch issue
  const { data: issue = {}, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axios(`${import.meta.env.VITE_API_URL}/issues/${id}`);
      return res.data;
    },
  });

  // Fetch timeline
  const { data: timeline = [] } = useQuery({
    queryKey: ["timeline", id],
    queryFn: async () => {
      const res = await axios(`${import.meta.env.VITE_API_URL}/timeline/${id}`);
      return res.data;
    },
  });

  const isOwner = issue?.citizen?.email === user?.email;

  const handleUpvote = async () => {
    try {
      await axiosSecure.patch(`/issues/${id}/upvote`);
      queryClient.invalidateQueries(["issue", id]);
      toast.success("Upvoted!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not upvote");
    }
  };

  const handleBoost = async () => {
    try {
      const { data } = await axiosSecure.post("/create-boost-session", {
        issueId: id,
        issueTitle: issue.title,
      });
      window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start boost payment");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/issues/${id}`);
      toast.success("Issue deleted");
      navigate("/dashboard/my-issues");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const {
    title,
    image,
    description,
    category,
    status,
    priority,
    location,
    upvoteCount = 0,
    isBoosted,
    citizen,
    assignedStaff,
    createdAt,
  } = issue;

  const timelineColorMap = {
    pending: "bg-yellow-400",
    "in-progress": "bg-blue-500",
    working: "bg-purple-500",
    resolved: "bg-green-500",
    closed: "bg-gray-500",
    rejected: "bg-red-500",
    boosted: "bg-orange-500",
  };

  return (
    <Container>
      <div className="py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img
                src={image}
                alt={title}
                className="w-full object-cover max-h-96"
              />
              {isBoosted && (
                <span
                  className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500
                  text-white text-xs font-bold px-3 py-1 rounded-full"
                >
                  <BsLightningChargeFill /> Boosted – High Priority
                </span>
              )}
            </div>

            {/* Staff Info */}
            {assignedStaff && (
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                  Assigned Staff
                </h3>
                <div className="flex items-center gap-3">
                  {assignedStaff.image && (
                    <img
                      src={assignedStaff.image}
                      className="w-10 h-10 rounded-full object-cover"
                      alt=""
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {assignedStaff.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {assignedStaff.email}
                    </p>
                    {assignedStaff.phone && (
                      <p className="text-gray-400 text-xs">
                        {assignedStaff.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${getStatusColor(status)}`}
              >
                {status}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${getPriorityColor(priority)}`}
              >
                {priority} priority
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                {category}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
              {title}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
              <MdLocationOn className="text-blue-500 text-lg flex-shrink-0" />
              {location}
            </div>

            <p className="text-gray-600 leading-relaxed">{description}</p>

            <hr />

            {/* Submitted by */}
            <div className="flex items-center gap-3">
              {citizen?.image && (
                <img
                  src={citizen.image}
                  className="w-9 h-9 rounded-full object-cover"
                  alt=""
                />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Reported by {citizen?.name}
                </p>
                <p className="text-xs text-gray-400">{formatDate(createdAt)}</p>
              </div>
            </div>

            <hr />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {/* Upvote */}
              {!isOwner && (
                <button
                  onClick={handleUpvote}
                  className="flex items-center gap-2 border border-blue-200 text-blue-600
                    font-semibold text-sm px-4 py-2 rounded-full hover:bg-blue-50 transition"
                >
                  <MdOutlineThumbUp /> Upvote ({upvoteCount})
                </button>
              )}

              {/* Boost */}
              {isOwner && !isBoosted && (
                <button
                  onClick={handleBoost}
                  className="flex items-center gap-2 bg-orange-500 text-white font-semibold
                    text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition"
                >
                  <BsLightningChargeFill /> Boost – ৳100
                </button>
              )}

              {/* Edit (owner + pending) */}
              {isOwner && status === "pending" && (
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 border border-green-200 text-green-700
                    font-semibold text-sm px-4 py-2 rounded-full hover:bg-green-50 transition"
                >
                  <MdEdit /> Edit
                </button>
              )}

              {/* Delete (owner) */}
              {isOwner && (
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-2 border border-red-200 text-red-600
                    font-semibold text-sm px-4 py-2 rounded-full hover:bg-red-50 transition"
                >
                  <MdDelete /> Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Issue Timeline
          </h2>

          {timeline.length === 0 ? (
            <p className="text-gray-400 text-sm">No timeline entries yet.</p>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

              <ul className="space-y-6 pl-14">
                {timeline.map((entry, idx) => (
                  <li key={entry._id || idx} className="relative">
                    {/* Dot */}
                    <span
                      className={`absolute -left-9 w-4 h-4 rounded-full border-2 border-white
                      shadow-sm ${timelineColorMap[entry.status] || "bg-gray-400"}`}
                    />

                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize
                          ${getStatusColor(entry.status)}`}
                        >
                          {entry.status}
                        </span>
                        <span
                          className="text-xs text-gray-400 capitalize bg-gray-100
                          px-2 py-0.5 rounded-full"
                        >
                          {entry.role}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium text-sm mt-1">
                        {entry.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          By: {entry.updatedBy}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditIssueModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        issue={issue}
        onSuccess={() => {
          queryClient.invalidateQueries(["issue", id]);
          setEditOpen(false);
        }}
      />
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this issue? This action cannot be undone."
      />
    </Container>
  );
};

export default IssueDetails;
