import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import RoleAssignModal from "./RoleAssignModal";
import Header from "./Header";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    const fetchUsers = async () => {
      try {
        const response = await axios.get("api/v1/superadmin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleAssignRole = async (userId) => {
    try {
      const response = await axios.get("api/v1/superadmin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data || []);
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  return (
    <div className="p-4">
      <Header />
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      <ul className="mb-4">
        {users.map((user) => (
          <li key={user._id} className="border p-2 mb-2 rounded">
            {user.name} ({user.email})
            {user.roles && user.roles.length > 0 && (
              <span className="ml-2 text-gray-600">
                Roles: {user.roles.map((r) => r.name).join(", ")}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedUserId(user._id);
                setShowModal(true);
              }}
              className="ml-4 bg-green-500 text-white p-1 rounded"
            >
              Assign Role
            </button>
          </li>
        ))}
      </ul>
      {showModal && (
        <RoleAssignModal
          userId={selectedUserId}
          onClose={() => setShowModal(false)}
          onAssignSuccess={handleAssignRole}
        />
      )}
    </div>
  );
}

export default UsersList;
