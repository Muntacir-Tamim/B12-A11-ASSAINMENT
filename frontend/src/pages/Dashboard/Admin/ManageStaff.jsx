import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AddStaffModal from "../../../components/Modal/AddStaffModal";
import DeleteConfirmModal from "../../../components/Modal/DeleteConfirmModal";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { TbFidgetSpinner } from "react-icons/tb";
import { imageUpload } from "../../../utils";

// Inline UpdateStaffModal to keep files self-contained
const UpdateStaffModal = ({ isOpen, onClose, staff, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: staff?.name || "",
      phone: staff?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = staff?.image;
      if (data.image?.[0]) imageUrl = await imageUpload(data.image[0]);
      await axiosSecure.patch(`/admin/staff/${staff._id}`, {
        name: data.name,
        phone: data.phone,
        image: imageUrl,
      });
      toast.success("Staff updated!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle as="h3" className="text-lg font-bold text-gray-800">
              Update Staff
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
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("name", { required: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
                {...register("phone")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Photo (optional)
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
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg
                  text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold
                  hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <TbFidgetSpinner className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

// ─── Main ManageStaff Page ────────────────────────────────────────────────────
const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: async () => {
      const res = await axiosSecure("/admin/staff");
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/admin/staff/${id}`);
      toast.success("Staff deleted");
      queryClient.invalidateQueries(["admin-staff"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Staff</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {staffList.length} staff member{staffList.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold
            px-5 py-2.5 rounded-xl hover:bg-blue-700 transition cursor-pointer"
        >
          <MdAdd className="text-lg" /> Add Staff
        </button>
      </div>

      {staffList.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">👷</p>
          <p className="text-lg font-medium">No staff members yet</p>
          <button
            onClick={() => setAddOpen(true)}
            className="mt-4 text-blue-600 hover:underline text-sm font-medium cursor-pointer"
          >
            Add your first staff member →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Staff Member", "Email", "Phone", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500
                        uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr
                    key={staff._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Staff Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {staff.image ? (
                          <img
                            src={staff.image}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center
                            justify-center text-blue-600 font-bold text-sm"
                          >
                            {staff.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <p className="text-sm font-semibold text-gray-800">
                          {staff.name}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">{staff.email}</p>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-500">
                        {staff.phone || "—"}
                      </p>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-400">
                        {formatDate(staff.created_at)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setUpdateTarget(staff)}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition cursor-pointer"
                          title="Edit"
                        >
                          <MdEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(staff._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
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

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => queryClient.invalidateQueries(["admin-staff"])}
      />

      {/* Update Staff Modal */}
      {updateTarget && (
        <UpdateStaffModal
          isOpen={!!updateTarget}
          onClose={() => setUpdateTarget(null)}
          staff={updateTarget}
          onSuccess={() => queryClient.invalidateQueries(["admin-staff"])}
        />
      )}

      {/* Delete Confirm */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        message="Are you sure you want to delete this staff member? Their Firebase account will also be removed."
      />
    </div>
  );
};

export default ManageStaff;
