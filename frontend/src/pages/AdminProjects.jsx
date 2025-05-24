import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assignUser, setAssignUser] = useState({});
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [ratingInputs, setRatingInputs] = useState({});

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await axios.get("/api/projects", { withCredentials: true });
    setProjects(res.data);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    const res = await axios.get("/api/admin/users", { withCredentials: true });
    setEmployees(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()),
    };
    if (editing) {
      await axios.put(`/api/projects/${editing}`, payload, {
        withCredentials: true,
      });
    } else {
      await axios.post("/api/projects", payload, { withCredentials: true });
    }
    setForm({
      title: "",
      description: "",
      requiredSkills: "",
      startDate: "",
      endDate: "",
    });
    setEditing(null);
    fetchProjects();
  };

  const handleEdit = (project) => {
    setEditing(project._id);
    setForm({
      title: project.title,
      description: project.description,
      requiredSkills: project.requiredSkills.join(", "),
      startDate: project.startDate ? project.startDate.slice(0, 10) : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await axios.delete(`/api/projects/${id}`, { withCredentials: true });
      fetchProjects();
    }
  };

  // Assign project to employee
  const handleAssign = async (projectId) => {
    const userId = assignUser[projectId];
    if (!userId) {
      alert("Please select an employee to assign.");
      return;
    }
    try {
      await axios.post(
        `/api/admin/users/${userId}/assign-project`,
        { projectId },
        { withCredentials: true }
      );
      alert("Project assigned!");
      fetchProjects();
    } catch (err) {
      alert("Failed to assign project.");
    }
  };

  // Set project rating
  const handleSetRating = async (projectId) => {
    const rating = Number(ratingInputs[projectId]);
    if (!rating || rating < 1 || rating > 10) {
      alert("Please enter a rating between 1 and 10.");
      return;
    }
    try {
      await axios.patch(
        `/api/projects/${projectId}/rating`,
        { rating },
        { withCredentials: true }
      );
      fetchProjects();
    } catch {
      alert("Failed to set rating.");
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="container">
        <h2>Manage Projects</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="search-input"
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="search-input"
          />
          <input
            name="requiredSkills"
            placeholder="Required Skills (comma separated)"
            value={form.requiredSkills}
            onChange={handleChange}
            required
            className="search-input"
          />
          <input
            name="startDate"
            type="date"
            placeholder="Start Date"
            value={form.startDate}
            onChange={handleChange}
            className="search-input"
          />
          <input
            name="endDate"
            type="date"
            placeholder="End Date"
            value={form.endDate}
            onChange={handleChange}
            className="search-input"
          />
          <button className="btn" type="submit">
            {editing ? "Update" : "Add"} Project
          </button>
          {editing && (
            <button
              className="btn"
              type="button"
              style={{ marginLeft: 10, background: "#888" }}
              onClick={() => {
                setEditing(null);
                setForm({
                  title: "",
                  description: "",
                  requiredSkills: "",
                  startDate: "",
                  endDate: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project._id} style={{ marginBottom: 10 }}>
                <strong>{project.title}</strong>
                <br />
                {project.description}
                <br />
                Skills: {project.requiredSkills.join(", ")}
                <br />
                {project.startDate && (
                  <>
                    Start: {new Date(project.startDate).toLocaleDateString()}{" "}
                  </>
                )}
                {project.endDate && (
                  <>End: {new Date(project.endDate).toLocaleDateString()}</>
                )}
                <br />
                <div style={{ margin: "8px 0" }}>
                  <span>
                    Rating:{" "}
                    <strong>
                      {project.rating !== null && project.rating !== undefined
                        ? project.rating
                        : "Not rated"}
                    </strong>
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={ratingInputs[project._id] || ""}
                    onChange={(e) =>
                      setRatingInputs((prev) => ({
                        ...prev,
                        [project._id]: e.target.value,
                      }))
                    }
                    style={{ width: 60, marginLeft: 8, marginRight: 4 }}
                    placeholder="1-10"
                  />
                  <button
                    className="btn"
                    onClick={() => handleSetRating(project._id)}
                    style={{ background: "#007bff" }}
                  >
                    Set Rating
                  </button>
                </div>
                <div style={{ margin: "8px 0" }}>
                  <select
                    value={assignUser[project._id] || ""}
                    onChange={(e) =>
                      setAssignUser((prev) => ({
                        ...prev,
                        [project._id]: e.target.value,
                      }))
                    }
                    className="search-input"
                    style={{
                      width: 200,
                      display: "inline-block",
                      marginRight: 8,
                    }}
                  >
                    <option value="">Assign to employee...</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn"
                    onClick={() => handleAssign(project._id)}
                    style={{ background: "#28a745" }}
                  >
                    Assign
                  </button>
                </div>
                <button
                  className="btn"
                  onClick={() => handleEdit(project)}
                  style={{ marginRight: 10 }}
                >
                  Edit
                </button>
                <button
                  className="btn"
                  onClick={() => handleDelete(project._id)}
                  style={{ background: "#d9534f" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
