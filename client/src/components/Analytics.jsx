import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Header from "./Header";

function Analytics() {
  const [analytics, setAnalytics] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "api/v1/superadmin/analytics/summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnalytics(response.data.data || {});
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };
    fetchAnalytics();
  }, [token]);

  return (
    <div className="p-4">
      <Header />
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-2 rounded">
          Total Users: {analytics.totalUsers || 0}
        </div>
        <div className="bg-green-100 p-2 rounded">
          Total Roles: {analytics.totalRoles || 0}
        </div>
        <div className="bg-yellow-100 p-2 rounded">
          Logins (7d): {analytics.loginsLast7Days || 0}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
