import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function AdminEnrollmentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await axios.get("/api/admin/enrollment-requests", {
      withCredentials: true,
    });
    setRequests(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    await axios.post(
      `/api/admin/enrollment-requests/${id}/approve`,
      {},
      { withCredentials: true }
    );
    fetchRequests();
  };

  const handleReject = async (id) => {
    await axios.post(
      `/api/admin/enrollment-requests/${id}/reject`,
      {},
      { withCredentials: true }
    );
    fetchRequests();
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="container">
        <h2>Pending Course Enrollment Requests</h2>
        {loading ? (
          <div>Loading...</div>
        ) : requests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul>
            {requests.map((req) => (
              <li key={req._id} style={{ marginBottom: 10 }}>
                <strong>{req.userId?.name}</strong> ({req.userId?.email})
                requested to enroll in <strong>{req.courseId?.title}</strong>
                <br />
                <button
                  className="btn"
                  onClick={() => handleApprove(req._id)}
                  style={{ marginRight: 10, background: "#28a745" }}
                >
                  Approve
                </button>
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
