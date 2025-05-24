import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function AdminProjectCompletions() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectComments, setRejectComments] = useState({});
  const [approvePercents, setApprovePercents] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    const res = await axios.get("/api/admin/project-completion-requests", {
      withCredentials: true,
    });
    setRequests(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    const percent = Number(approvePercents[id]) || 100;
    await axios.post(
      `/api/admin/project-completion-requests/${id}/approve`,
      { percent },
      { withCredentials: true }
    );
    fetchRequests();
  };

  const handleReject = async (id) => {
    const adminComment = rejectComments[id] || "";
    await axios.post(
      `/api/admin/project-completion-requests/${id}/reject`,
      { adminComment },
      { withCredentials: true }
    );
    fetchRequests();
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="container">
        <h2>Pending Project Completion Requests</h2>
        {loading ? (
          <div>Loading...</div>
        ) : requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul>
            {requests.map((req) => (
              <li key={req._id} style={{ marginBottom: 16 }}>
                <strong>{req.userId?.name}</strong> ({req.userId?.email})
                requests to mark project <strong>{req.projectId?.title}</strong>{" "}
                as completed.
                <br />
                <span style={{ color: "#555" }}>
                  Employee comment: {req.comment || <em>No comment</em>}
                </span>
                <br />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={approvePercents[req._id] || ""}
                  onChange={(e) =>
                    setApprovePercents((prev) => ({
                      ...prev,
                      [req._id]: e.target.value,
                    }))
                  }
                  placeholder="Completion %"
                  style={{ width: 80, marginRight: 8 }}
                />
                <button
                  className="btn"
                  onClick={() => handleApprove(req._id)}
                  style={{ marginRight: 10, background: "#28a745" }}
                >
                  Approve
                </button>
                <input
                  type="text"
                  placeholder="Admin comment (optional)"
                  value={rejectComments[req._id] || ""}
                  onChange={(e) =>
                    setRejectComments((prev) => ({
                      ...prev,
                      [req._id]: e.target.value,
                    }))
                  }
                  style={{ marginRight: 8 }}
                />
                <button
                  className="btn"
                  onClick={() => handleReject(req._id)}
                  style={{ background: "#d9534f" }}
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
