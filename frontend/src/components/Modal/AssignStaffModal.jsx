import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { TbFidgetSpinner } from "react-icons/tb";

const AssignStaffModal = ({ isOpen, onClose, issue, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["staff-list"],
    enabled: isOpen,
    queryFn: async () => {
      const res = await axiosSecure("/admin/staff");
      return res.data;
    },
  });

  const handleAssign = async () => {
    if (!selectedStaff) return toast.error("Please select a staff member");
    setLoading(true);
    try {
      await axiosSecure.patch(`/admin/issues/${issue._id}/assign`, {
        staffId: selectedStaff,
      });
      toast.success("Staff assigned successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <DialogTitle as="h3" className="text-lg font-bold text-gray-800 mb-1">
            Assign Staff
          </DialogTitle>
          <p className="text-sm text-gray-500 mb-4">
            Assigning staff for: <strong>{issue?.title}</strong>
          </p>

          {isLoading ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              Loading staff...
            </p>
          ) : (
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                focus:outline-blue-400 bg-gray-50 mb-5"
            >
              <option value="">-- Select a staff member --</option>
              {staffList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm
                font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={loading || !selectedStaff}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold
                hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <TbFidgetSpinner className="animate-spin" /> Assigning...
                </>
              ) : (
                "Assign"
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AssignStaffModal;
