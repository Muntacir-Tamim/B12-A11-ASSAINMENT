import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { imageUpload } from "../../utils";
import toast from "react-hot-toast";
import { useState } from "react";
import { TbFidgetSpinner } from "react-icons/tb";

const AddStaffModal = ({ isOpen, onClose, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = "";
      if (data.image?.[0]) imageUrl = await imageUpload(data.image[0]);

      await axiosSecure.post("/admin/staff", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        image: imageUrl,
      });
      toast.success("Staff account created!");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create staff");
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
              Add New Staff
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Staff full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="staff@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                placeholder="+880..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("phone", { required: "Phone is required" })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo (optional)
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
                    <TbFidgetSpinner className="animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Staff"
                )}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddStaffModal;
