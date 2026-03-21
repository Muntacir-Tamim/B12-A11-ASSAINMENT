import MenuItem from "./MenuItem";
import {
  MdOutlineDashboard,
  MdOutlineReportProblem,
  MdOutlinePeople,
  MdOutlinePayments,
  MdOutlineManageAccounts,
} from "react-icons/md";

const AdminMenu = () => {
  return (
    <>
      <MenuItem
        icon={MdOutlineReportProblem}
        label="All Issues"
        address="all-issues"
      />
      <MenuItem
        icon={MdOutlinePeople}
        label="Manage Citizens"
        address="manage-citizens"
      />
      <MenuItem
        icon={MdOutlineManageAccounts}
        label="Manage Staff"
        address="manage-staff"
      />
      <MenuItem icon={MdOutlinePayments} label="Payments" address="payments" />
    </>
  );
};

export default AdminMenu;
