import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import IssueCard from "../../components/Home/IssueCard";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { MdSearch, MdFilterList } from "react-icons/md";
import Container from "../../components/Shared/Container";

const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
  "Other",
];
const STATUSES = [
  "pending",
  "in-progress",
  "working",
  "resolved",
  "closed",
  "rejected",
];
const PRIORITIES = ["normal", "high"];
const LIMIT = 9;

const AllIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [urlParams] = useSearchParams();

  const [search, setSearch] = useState(urlParams.get("search") || "");
  const [category, setCategory] = useState(urlParams.get("category") || "");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [inputVal, setInputVal] = useState(urlParams.get("search") || "");

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, status, priority]);

  const {
    data = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["all-issues", search, category, status, priority, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (status) params.set("status", status);
      if (priority) params.set("priority", priority);
      params.set("page", page);
      params.set("limit", LIMIT);
      const res = await axios(
        `${import.meta.env.VITE_API_URL}/issues?${params.toString()}`,
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const { issues = [], total = 0 } = data;
  const totalPages = Math.ceil(total / LIMIT);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal.trim());
  };

  const handleUpvote = async (id) => {
    if (!user) return navigate("/login");
    try {
      await axiosSecure.patch(`/issues/${id}/upvote`);
      queryClient.invalidateQueries(["all-issues"]);
      toast.success("Upvoted!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not upvote");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setInputVal("");
    setCategory("");
    setStatus("");
    setPriority("");
    setPage(1);
  };

  return (
    <Container>
      <div className="  py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-center font-extrabold text-gray-800">
            All Issues
          </h1>
          <p className="text-gray-500 text-center mt-4">
            Browse, search, and filter all reported public issues
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search by title, category or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl
                focus:outline-blue-400 text-sm bg-gray-50"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold
              hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3">
            <MdFilterList className="text-gray-500 text-xl flex-shrink-0" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50
              focus:outline-blue-400 cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50
              focus:outline-blue-400 cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50
              focus:outline-blue-400 cursor-pointer"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>

            {(search || category || status || priority) && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:underline font-medium"
              >
                Clear filters
              </button>
            )}

            <span className="ml-auto text-sm text-gray-400">
              {total} issue{total !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>

        {/* Loading overlay */}
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-6">
            <LoadingSpinner smallHeight />
          </div>
        )}

        {/* Issue Grid */}
        {!isLoading && issues.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-medium">
              No issues found matching your criteria
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:underline text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onUpvote={handleUpvote}
                currentUserEmail={user?.email}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40
              hover:bg-gray-50 transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition
                    ${
                      page === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border text-sm font-medium disabled:opacity-40
              hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default AllIssues;
