import AdminProvidersTable from "../AllUsers/AdminProvidersTable";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardCard />
      <AdminProvidersTable />
    </div>
  );
};

export default Dashboard;
