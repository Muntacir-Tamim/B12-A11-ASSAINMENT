import MenuItem from "./MenuItem";
import { MdOutlineAssignment } from "react-icons/md";

const StaffMenu = () => {
  return (
    <>
      <MenuItem
        icon={MdOutlineAssignment}
        label="Assigned Issues"
        address="assigned-issues"
      />
    </>
  );
};

export default StaffMenu;
