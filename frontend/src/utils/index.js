import axios from "axios";

export const imageUpload = async (imageData) => {
  const formData = new FormData();
  formData.append("image", imageData);

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData,
  );
  // return data?.data?.display_url;
};

// save or update user in db
export const saveOrUpdateUser = async (userData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user`,
    userData,
  );
  return data;
};

// Format date nicely
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Status badge color
export const getStatusColor = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    working: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
    boosted: "bg-orange-100 text-orange-800",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

// Priority badge color
export const getPriorityColor = (priority) => {
  return priority === "high"
    ? "bg-red-100 text-red-700"
    : "bg-gray-100 text-gray-600";
};
