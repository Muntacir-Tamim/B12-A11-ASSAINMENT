import useRole from "../../../hooks/useRole";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import CitizenStatistics from "../../../components/Dashboard/Statistics/CitizenStatistics";
import StaffStatistics from "../../../components/Dashboard/Statistics/StaffStatistics";

const Statistics = () => {
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) return <LoadingSpinner />;

  return (
    <div>
      {role === "citizen" && <CitizenStatistics />}
      {role === "staff" && <StaffStatistics />}
      {role === "admin" && <AdminStatistics />}
    </div>
  );
};

export default Statistics;
