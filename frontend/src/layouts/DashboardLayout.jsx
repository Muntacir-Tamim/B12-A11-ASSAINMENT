import { Outlet } from "react-router";
import Sidebar from "../components/Dashboard/Sidebar/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen md:flex bg-gray-50">
      {/* Left Side: Sidebar */}
      <Sidebar />
      {/* Right Side: Dynamic Content */}
      <div className="flex-1 md:ml-64">
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
