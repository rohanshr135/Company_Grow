import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    skills: "",
    experience: "",
    profileImage: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/user/profile", { withCredentials: true })
      .then((res) => {
        setProfile(res.data);
        setForm({
          name: res.data.name || "",
          skills: res.data.skills ? res.data.skills.join(", ") : "",
          experience: res.data.experience || "",
          profileImage: res.data.profileImage || "",
        });
      })
      .catch(() => setProfile(null));

    // Fetch enrollments with progress
    axios
      .get("/api/user/enrollments", { withCredentials: true })
      .then((res) => setEnrollments(res.data))
      .catch(() => setEnrollments([]));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      const res = await axios.put("/api/user/profile", payload, {
        withCredentials: true,
      });
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile">
      <Navbar />
      <div className="container">
        <h2>Profile</h2>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 20 }}
        >
          <img
            src={profile.profileImage}
            alt="Profile"
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: 20,
              border: "2px solid #007bff",
            }}
          />
          <div>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
            <p>
              <strong>Total Rewards:</strong>{" "}
              {typeof profile.badge === "number"
                ? `$${profile.badge.toFixed(2)}`
                : "No rewards earned yet."}
            </p>
          </div>
        </div>
        {editing ? (
          <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
            <div>
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="search-input"
              />
            </div>
            <div>
              <label>Skills (comma separated)</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="search-input"
                placeholder="e.g. React, Node.js"
              />
            </div>
            <div>
              <label>Experience</label>
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="search-input"
                placeholder="e.g. 3 years"
              />
            </div>
            <div>
              <label>Profile Image URL</label>
              <input
                name="profileImage"
                value={form.profileImage}
                onChange={handleChange}
                className="search-input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="btn" type="submit">
              Save
            </button>
            <button
              className="btn"
              type="button"
              style={{ marginLeft: 10, background: "#888" }}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <section>
              <h3>Skills</h3>
              <ul>
                {profile.skills && profile.skills.length ? (
                  profile.skills.map((s, i) => <li key={i}>{s}</li>)
                ) : (
                  <li>No skills listed.</li>
                )}
              </ul>
            </section>
            <section>
              <h3>Experience</h3>
              <p>{profile.experience || "No experience listed."}</p>
            </section>
            <button className="btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
            <section>
              <h3>Training Progress</h3>
              {enrollments.length === 0 ? (
                <p>No courses enrolled.</p>
              ) : (
                <ul>
                  {enrollments.map((enr) => (
                    <li key={enr._id} style={{ marginBottom: 10 }}>
                      <strong>{enr.courseId?.title || "Course"}</strong>
                      <div style={{ margin: "6px 0" }}>
                        <div
                          style={{
                            background: "#eee",
                            borderRadius: 8,
                            height: 16,
                            width: 250,
                            overflow: "hidden",
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            style={{
                              background: "#007bff",
                              width: `${enr.progress || 0}%`,
                              height: "100%",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <span style={{ marginLeft: 10 }}>
                          {enr.progress || 0}% complete
                        </span>
                      </div>
                      {enr.completedMilestones &&
                        enr.completedMilestones.length > 0 && (
                          <div style={{ fontSize: 12, color: "#555" }}>
                            Milestones: {enr.completedMilestones.join(", ")}
                          </div>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <button
              className="btn"
              style={{
                marginTop: 40,
                background: "#dc3545",
                color: "#fff",
                float: "right",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
