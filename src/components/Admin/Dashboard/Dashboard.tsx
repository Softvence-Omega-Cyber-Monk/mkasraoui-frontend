import { useGetMeQuery } from "@/redux/features/user/userApi";
import AdminProvidersTable from "../AllUsers/AdminProvidersTable";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const { data: me } = useGetMeQuery();
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {me?.name}
        </h1>
        <p className="mt-1 text-gray-600">Manage and monitor your dashboard.</p>
      </div>

      <DashboardCard />
      <AdminProvidersTable />
    </div>
  );
};

export default Dashboard;
