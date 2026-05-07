import { useAuth } from "../context/authContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome {user?.name}
      </h1>

      <button onClick={logout} className="mt-4 bg-red-500 text-white p-2">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;