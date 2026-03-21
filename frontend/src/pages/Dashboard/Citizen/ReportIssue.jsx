import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { imageUpload } from "../../../utils";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";
import { MdOutlineAddCircleOutline, MdOutlineLock } from "react-icons/md";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { Link } from "react-router";

const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
  "Other",
];

const ReportIssue = () => {
  const { user } = useAuth();
  const [role, isRoleLoading, isPremium, isBlocked] = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (payload) => axiosSecure.post("/issues", payload),
    onSuccess: () => {
      toast.success("Issue reported successfully!");
      reset();
      navigate("/dashboard/my-issues");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit issue");
    },
  });

  const onSubmit = async (data) => {
    const { title, description, category, location, image } = data;
    const imageFile = image?.[0];
    try {
      const imageUrl = imageFile ? await imageUpload(imageFile) : "";
      const issueData = {
        title,
        description,
        category,
        location,
        image: imageUrl,
        citizen: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      };
      await mutateAsync(issueData);
    } catch (err) {
      console.error(err);
    }
  };

  if (isRoleLoading) return <LoadingSpinner />;

  // Blocked citizen
  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-6">
        <MdOutlineLock className="text-red-400 text-7xl" />
        <h2 className="text-2xl font-bold text-gray-800">Account Blocked</h2>
        <p className="text-gray-500 max-w-md">
          Your account has been blocked by the admin. You cannot submit new
          issues. Please contact the municipal authorities.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <MdOutlineAddCircleOutline className="text-blue-600 text-3xl" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Report an Issue</h2>
          <p className="text-gray-500 text-sm">
            {isPremium
              ? "Premium member – unlimited submissions"
              : "Free plan – up to 3 issues. "}
            {!isPremium && (
              <Link
                to="/dashboard/profile"
                className="text-blue-600 hover:underline font-medium"
              >
                Upgrade to Premium
              </Link>
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Large pothole on Main Road near bus stop"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                focus:outline-blue-400 bg-gray-50 text-sm"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 100,
                  message: "Title too long (max 100 chars)",
                },
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                focus:outline-blue-400 bg-gray-50 text-sm cursor-pointer"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">-- Select a category --</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe the issue in detail — what is the problem, how severe it is, any safety concerns..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                focus:outline-blue-400 bg-gray-50 text-sm resize-none"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Please write at least 20 characters",
                },
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mirpur-10, Dhaka, near the main roundabout"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl
                focus:outline-blue-400 bg-gray-50 text-sm"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 bg-blue-50/30">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                  file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700
                  hover:file:bg-blue-200 cursor-pointer"
                {...register("image", { required: "A photo is required" })}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG or JPEG – max 5MB
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm
              hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <>
                <TbFidgetSpinner className="animate-spin text-lg" />
                Submitting...
              </>
            ) : (
              "Submit Issue Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
