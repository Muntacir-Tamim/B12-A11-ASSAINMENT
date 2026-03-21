import { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import MenuItem from "./Menu/MenuItem";
import AdminMenu from "./Menu/AdminMenu";
import CitizenMenu from "./Menu/CitizenMenu";
import StaffMenu from "./Menu/StaffMenu";
import { GrLogout } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { AiOutlineBars } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { MdOutlineReportProblem } from "react-icons/md";

const Sidebar = () => {
  const { logOut } = useAuth();
  const [isActive, setActive] = useState(false);
  const [role, isRoleLoading] = useRole();

  const handleToggle = () => setActive(!isActive);

  if (isRoleLoading) return <LoadingSpinner />;

  return (
    <>
      {/* Mobile top bar */}
      <div className="bg-white text-gray-800 flex justify-between md:hidden shadow-sm">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link to="/" className="flex items-center gap-2">
              <MdOutlineReportProblem className="text-blue-600 text-2xl" />
              <span className="font-bold text-blue-700">CivicFix</span>
            </Link>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-white
          border-r border-gray-200 w-64 space-y-2 px-2 py-4 absolute inset-y-0 left-0 transform
          ${isActive && "-translate-x-full"} md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className="w-full hidden md:flex px-4 py-3 shadow-sm rounded-lg justify-center
            items-center bg-blue-50 mx-auto mb-4"
          >
            <Link to="/" className="flex items-center gap-2">
              <MdOutlineReportProblem className="text-blue-600 text-2xl" />
              <span className="font-bold text-blue-700 text-lg">CivicFix</span>
            </Link>
          </div>

          {/* Menu */}
          <div className="flex flex-col justify-between flex-1 mt-2">
            <nav>
              {/* Common: Statistics */}
              <MenuItem
                icon={BsGraphUp}
                label="Statistics"
                address="/dashboard"
              />

              {/* Role-based menu */}
              {role === "citizen" && <CitizenMenu />}
              {role === "staff" && <StaffMenu />}
              {role === "admin" && <AdminMenu />}
            </nav>
          </div>

          {/* Bottom */}
          <div>
            <hr className="my-2" />
            <MenuItem
              icon={FcSettings}
              label="Profile"
              address="/dashboard/profile"
            />
            <button
              onClick={logOut}
              className="flex cursor-pointer w-full items-center px-4 py-2 mt-2 text-gray-600
                hover:bg-red-50 hover:text-red-600 transition-colors duration-300 transform rounded-lg"
            >
              <GrLogout className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
