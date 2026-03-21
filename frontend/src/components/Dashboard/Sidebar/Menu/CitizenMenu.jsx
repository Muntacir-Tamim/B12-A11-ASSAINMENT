import MenuItem from "./MenuItem";
import {
  MdOutlineReportProblem,
  MdOutlineListAlt,
  MdOutlineAddCircleOutline,
} from "react-icons/md";

const CitizenMenu = () => {
  return (
    <>
      <MenuItem
        icon={MdOutlineAddCircleOutline}
        label="Report Issue"
        address="report-issue"
      />
      <MenuItem icon={MdOutlineListAlt} label="My Issues" address="my-issues" />
    </>
  );
};

export default CitizenMenu;
