import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import DeleteConfirmModal from "../../../components/Modal/DeleteConfirmModal";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils";
import { MdVerified, MdBlock, MdCheckCircle } from "react-icons/md";

const ManageCitizens = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [confirmTarget, setConfirmTarget] = useState(null); // { email, newState, name }

  const { data: citizens = [], isLoading } = useQuery({
    queryKey: ["citizens"],
    queryFn: async () => {
      const res = await axiosSecure("/admin/citizens");
      return res.data;
    },
  });

  const handleBlockToggle = async (email, isBlocked) => {
    try {
      await axiosSecure.patch(`/admin/citizen/block/${email}`, { isBlocked });
      toast.success(`User ${isBlocked ? "blocked" : "unblocked"} successfully`);
      queryClient.invalidateQueries(["citizens"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Citizens</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {citizens.length} registered citizen{citizens.length !== 1 ? "s" : ""}
        </p>
      </div>

      {citizens.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">👥</p>
          <p className="text-lg font-medium">No citizens registered yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {[
                    "User",
                    "Email",
                    "Subscription",
                    "Joined",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-gray-500
                        uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {citizens.map((citizen) => (
                  <tr
                    key={citizen._id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition
                      ${citizen.isBlocked ? "bg-red-50/30" : ""}`}
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {citizen.image ? (
                          <img
                            src={citizen.image}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full bg-gray-200 flex items-center
                            justify-center text-gray-500 font-bold text-sm"
                          >
                            {citizen.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {citizen.name}
                          </p>
                          {citizen.isBlocked && (
                            <span className="text-xs text-red-500 font-medium">
                              Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">{citizen.email}</p>
                    </td>

                    {/* Subscription */}
                    <td className="px-5 py-4">
                      {citizen.isPremium ? (
                        <span
                          className="flex items-center gap-1 text-xs font-semibold
                          text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full w-fit"
                        >
                          <MdVerified /> Premium
                        </span>
                      ) : (
                        <span
                          className="text-xs font-medium text-gray-400 bg-gray-100
                          px-2.5 py-1 rounded-full"
                        >
                          Free
                        </span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-400">
                        {formatDate(citizen.created_at)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {citizen.isBlocked ? (
                        <span
                          className="flex items-center gap-1 text-xs font-semibold
                          text-red-600 bg-red-100 px-2 py-0.5 rounded-full w-fit"
                        >
                          <MdBlock /> Blocked
                        </span>
                      ) : (
                        <span
                          className="flex items-center gap-1 text-xs font-semibold
                          text-green-600 bg-green-100 px-2 py-0.5 rounded-full w-fit"
                        >
                          <MdCheckCircle /> Active
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          setConfirmTarget({
                            email: citizen.email,
                            newState: !citizen.isBlocked,
                            name: citizen.name,
                          })
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer
                          ${
                            citizen.isBlocked
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                      >
                        {citizen.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Block/Unblock Modal */}
      <DeleteConfirmModal
        isOpen={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() =>
          handleBlockToggle(confirmTarget.email, confirmTarget.newState)
        }
        message={`Are you sure you want to ${
          confirmTarget?.newState ? "block" : "unblock"
        } ${confirmTarget?.name}? ${
          confirmTarget?.newState
            ? "They will not be able to submit, edit, or upvote issues."
            : "Their account will be restored to normal access."
        }`}
      />
    </div>
  );
};

export default ManageCitizens;
