import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imageUpload } from "../../utils";
import toast from "react-hot-toast";
import { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";

const CATEGORIES = [
  "Pothole",
  "Streetlight",
  "Water Leakage",
  "Garbage Overflow",
  "Damaged Footpath",
  "Other",
];

const EditIssueModal = ({ isOpen, onClose, issue, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: issue?.title || "",
      description: issue?.description || "",
      category: issue?.category || "",
      location: issue?.location || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = issue?.image;
      if (data.image?.[0]) imageUrl = await imageUpload(data.image[0]);

      await axiosSecure.patch(`/issues/${issue._id}`, {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        image: imageUrl,
      });
      toast.success("Issue updated!");
      onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle as="h3" className="text-lg font-bold text-gray-800">
              Edit Issue
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("category", { required: "Category is required" })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("location", { required: "Location is required" })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4
                  file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 border border-dashed border-blue-200 rounded-lg py-2"
                {...register("image")}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm
                  font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold
                  hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <TbFidgetSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditIssueModal;
