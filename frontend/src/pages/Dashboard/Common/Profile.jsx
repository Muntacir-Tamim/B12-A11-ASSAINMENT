import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { imageUpload } from "../../../utils";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { TbFidgetSpinner } from "react-icons/tb";
import { MdVerified } from "react-icons/md";
import axios from "axios";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [role, isRoleLoading, isPremium, isBlocked] = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure("/user/me");
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ name, image }) =>
      axiosSecure.patch("/user/me", { name, image }),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries(["profile"]);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const file = form.image.files[0];
    let imageUrl = profile?.image;

    try {
      setUploading(true);
      if (file) imageUrl = await imageUpload(file);
      await updateUserProfile(name, imageUrl);
      await updateMutation.mutateAsync({ name, image: imageUrl });
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const { data } = await axiosSecure.post("/create-subscription-session");
      window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start payment");
    }
  };

  if (isLoading || isRoleLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

      {/* Blocked Warning */}
      {isBlocked && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6 text-red-700">
          ⚠️ Your account has been <strong>blocked</strong> by the admin. Please
          contact the municipal authorities to resolve this issue.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6">
          <img
            src={user?.photoURL || "https://i.ibb.co/MBtjqXQ/no-avatar.png"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-800">
                {user?.displayName}
              </p>
              {isPremium && (
                <span
                  className="flex items-center gap-1 bg-yellow-100 text-yellow-700
                  text-xs font-semibold px-2 py-0.5 rounded-full"
                >
                  <MdVerified /> Premium
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span
              className="inline-block mt-1 text-xs bg-blue-100 text-blue-700
              font-semibold px-2 py-0.5 rounded-full capitalize"
            >
              {role}
            </span>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={user?.displayName || ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <input
              name="image"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || updateMutation.isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold
              hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading || updateMutation.isPending ? (
              <>
                <TbFidgetSpinner className="animate-spin" /> Saving...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>

        {/* Subscribe Section (citizen only) */}
        {role === "citizen" && !isPremium && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Get Premium
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Free users can submit up to 3 issues. Subscribe for ৳1,000 to
              report unlimited issues and get priority support.
            </p>
            <button
              onClick={handleSubscribe}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold
                hover:bg-yellow-600 transition"
            >
              Subscribe – ৳1,000
            </button>
          </div>
        )}

        {role === "citizen" && isPremium && (
          <div className="mt-8 border-t pt-6 flex items-center gap-3">
            <MdVerified className="text-yellow-500 text-2xl" />
            <p className="text-gray-700 font-medium">
              You are a <strong>Premium Member</strong>. Enjoy unlimited issue
              submissions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
