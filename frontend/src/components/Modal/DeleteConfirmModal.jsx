import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          <DialogTitle as="h3" className="text-lg font-bold text-gray-800">
            Confirm Deletion
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            {message || "Are you sure? This action cannot be undone."}
          </p>
          <hr className="my-5" />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg
                hover:bg-red-600 transition cursor-pointer"
            >
              Yes, Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmModal;
