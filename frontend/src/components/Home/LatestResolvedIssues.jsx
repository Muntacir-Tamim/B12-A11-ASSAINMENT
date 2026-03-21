import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import IssueCard from "./IssueCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import Container from "../Shared/Container";

const LatestResolvedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["latest-resolved"],
    queryFn: async () => {
      const res = await axios(
        `${import.meta.env.VITE_API_URL}/latest-resolved`,
      );
      return res.data;
    },
  });

  const handleUpvote = async (id) => {
    if (!user) return navigate("/login");
    try {
      await axiosSecure.patch(`/issues/${id}/upvote`);
      queryClient.invalidateQueries(["latest-resolved"]);
      toast.success("Upvoted!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not upvote");
    }
  };

  if (isLoading) return <LoadingSpinner smallHeight />;

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="flex items-center justify-between mb-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-gray-800 sm:text-left text-center">
              Recently Resolved Issues
            </h2>
            <p className="text-gray-500 mt-1 sm:text-left text-center">
              Issues that have been successfully addressed by our teams
            </p>
          </div>
          <Link
            to="/all-issues"
            className="hidden md:block text-sm font-semibold text-blue-600 hover:underline"
          >
            View All →
          </Link>
        </div>

        {issues.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No resolved issues yet.
          </p>
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

        <div className="text-center mt-8 md:hidden">
          <Link
            to="/all-issues"
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            View All Issues →
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default LatestResolvedIssues;
