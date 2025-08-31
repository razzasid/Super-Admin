import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";

function RoleAssignModal({ userId, onClose, onAssignSuccess }) {
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    // Fetch available roles (mocked for now, replace with API call if needed)
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          "api/v1/superadmin/roles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRoles(response.data.data || []);
      } catch (err) {
        setError("Failed to load roles.");
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, [token]);

  const handleAssign = async () => {
    if (!roleId) {
      setError("Please select a role.");
      return;
    }
    setError("");
    try {
      await axios.post(
        "http://localhost:3000/api/v1/superadmin/assign-role",
        { userId, roleId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onAssignSuccess(userId); // Notify parent to refresh data
      onClose();
    } catch (err) {
      setError("Failed to assign role. Check server or permissions.");
      console.error("Error assigning role:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-md w-96">
        <h3 className="text-lg font-bold mb-2">Assign Role</h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-green-500 text-white p-2 rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleAssignModal;
