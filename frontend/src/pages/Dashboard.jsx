import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // For employee project completion requests
  const [completionComments, setCompletionComments] = useState({});
  const [pendingCompletions, setPendingCompletions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const profileRes = await axios.get("/api/user/profile", {
          withCredentials: true,
        });
        setData(profileRes.data);

        if (user.role === "admin") {
          const [usersRes, coursesRes] = await Promise.all([
            axios.get("/api/admin/users", { withCredentials: true }),
            axios.get("/api/courses", { withCredentials: true }),
          ]);
          setUsers(usersRes.data);
          setCourses(coursesRes.data);
        }
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.role]);

  useEffect(() => {
    async function fetchPendingCompletions() {
      try {
        const res = await axios.get("/api/user/project-completion-requests", {
          withCredentials: true,
        });
        setPendingCompletions(
          res.data.map((r) =>
            typeof r.projectId === "object" ? r.projectId._id : r.projectId
          )
        );
      } catch {
        setPendingCompletions([]);
      }
    }
    if (user && user.role === "employee") fetchPendingCompletions();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  // --- Admin Dashboard ---
  if (user.role === "admin") {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="container">
          <h2>Admin Dashboard</h2>
          <div style={{ marginBottom: "2rem" }}>
            <Link
              to="/admin/courses"
              className="btn"
              style={{ marginRight: 10 }}
            >
              Manage Courses
            </Link>
            <Link
              to="/admin/projects"
              className="btn"
              style={{ marginRight: 10 }}
            >
              Manage Projects
            </Link>
            <Link to="/analytics" className="btn">
              View Analytics
            </Link>
          </div>
          <section>
            <h3>All Employees</h3>
            {users.length === 0 ? (
              <p>No employees found.</p>
            ) : (
              <ul>
                {users.map((u) => (
                  <li key={u._id}>
                    {u.name} ({u.email}) - Skills:{" "}
                    {u.skills?.join(", ") || "None"}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3>All Courses</h3>
            {courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              <ul>
                {courses.map((c) => (
                  <li key={c._id}>
                    {c.title} ({c.level})
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    );
  }

  // --- Employee Dashboard ---
  return (
    <div className="dashboard">
      <Navbar />
      <div className="container">
        <h2>Welcome, {data?.name}</h2>
        <section>
          <h3>Skill Progress</h3>
          {data?.skills && data.skills.length ? (
            <ul>
              {data.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No skills listed.</p>
          )}
        </section>

        <section>
          <h3>Assigned Projects</h3>
          <ul>
            {data?.assignedProjects && data.assignedProjects.length ? (
              data.assignedProjects
                .filter(
                  (p) =>
                    !data.completedProjects ||
                    !data.completedProjects.some(
                      (cp) =>
                        (typeof cp === "object" ? cp._id : cp) ===
                        (typeof p === "object" ? p._id : p)
                    )
                )
                .map((p, i) => {
                  // Get percent from projectCompletionPercent
                  const percent =
                    data.projectCompletionPercent &&
                    data.projectCompletionPercent[p._id] !== undefined
                      ? data.projectCompletionPercent[p._id]
                      : null;

                  const status =
                    percent === 100
                      ? "completed"
                      : (data.projectStatus && data.projectStatus[p._id]) ||
                        p.status ||
                        "pending";
                  const isPending = pendingCompletions.includes(
                    p._id || (typeof p === "object" ? p._id : p)
                  );
                  return (
                    <li key={i}>
                      {p.title || p}
                      <span
                        style={{
                          marginLeft: 10,
                          color:
                            status === "completed"
                              ? "green"
                              : isPending
                              ? "orange"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {status === "completed"
                          ? "Completed"
                          : isPending
                          ? "Waiting for admin"
                          : "Pending"}
                      </span>
                      <span style={{ marginLeft: 10, color: "#007bff" }}>
                        {percent !== null && `(Admin Completion: ${percent}%)`}
                      </span>
                      {user.role === "employee" &&
                        status !== "completed" &&
                        !isPending && (
                          <form
                            style={{ display: "inline-block", marginLeft: 10 }}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              try {
                                await axios.post(
                                  "/api/user/projects/completion-request",
                                  {
                                    projectId: p._id,
                                    comment: completionComments[p._id] || "",
                                  },
                                  { withCredentials: true }
                                );
                                setPendingCompletions([
                                  ...pendingCompletions,
                                  p._id,
                                ]);
                              } catch (err) {
                                alert("Failed to submit completion request.");
                              }
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Comment"
                              value={completionComments[p._id] || ""}
                              onChange={(e) =>
                                setCompletionComments((prev) => ({
                                  ...prev,
                                  [p._id]: e.target.value,
                                }))
                              }
                              style={{ marginRight: 6 }}
                            />
                            <button className="btn" type="submit">
                              Mark as Completed
                            </button>
                          </form>
                        )}
                    </li>
                  );
                })
            ) : (
              <li>No projects assigned.</li>
            )}
          </ul>
        </section>
        <section>
          <h3>Completed Projects</h3>
          <ul>
            {data?.completedProjects && data.completedProjects.length ? (
              data.completedProjects.map((p, i) => (
                <li key={i} style={{ color: "green", fontWeight: "bold" }}>
                  {p.title || p.name || p}
                </li>
              ))
            ) : (
              <li>No projects completed yet.</li>
            )}
          </ul>
        </section>
        <section>
          <h3>Active Courses</h3>
          <ul>
            {data?.enrolledCourses && data.enrolledCourses.length ? (
              data.enrolledCourses.map((c, i) => (
                <li key={i}>{c.title || c}</li>
              ))
            ) : (
              <li>No courses enrolled.</li>
            )}
          </ul>
        </section>
        <section>
          <h3>Total Rewards</h3>
          <p>
            {typeof data?.badge === "number" ? (
              <>${data.badge.toFixed(2)}</>
            ) : (
              "No rewards earned yet."
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
