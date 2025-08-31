import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import Header from "./Header";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/superadmin/audit-logs?page=${currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLogs(response.data.data || []);
        setPagination(response.data.pagination || {});
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      }
    };
    fetchLogs();
  }, [token, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <Header />
      <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
      <ul>
        {logs.map((log) => (
          <li key={log._id} className="border p-2 mb-2 rounded">
            {log.action} by{" "}
            {log.actorUserId?.name || log.actorUserId || "Unknown"} at{" "}
            {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
      {pagination.totalPages > 1 && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-black px-3 py-1 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="bg-gray-300 text-black px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
