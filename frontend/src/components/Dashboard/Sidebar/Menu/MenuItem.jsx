import { NavLink } from "react-router";

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-2 my-2 transition-colors duration-300 transform rounded-lg
        hover:bg-blue-100 hover:text-blue-700
        ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600"}`
      }
    >
      <Icon className="w-5 h-5" />
      <span className="mx-4 font-medium">{label}</span>
    </NavLink>
  );
};

export default MenuItem;
