import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function CourseCatalog() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    media: "",
    milestones: "",
  });
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    fetchCourses();
    if (user?.role === "employee") {
      fetchPendingRequests();
    }
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await axios.get("/api/courses", { withCredentials: true });
    setCourses(res.data);
    setLoading(false);
  };

  r;
  const fetchPendingRequests = async () => {
    try {
      const res = await axios.get("/api/user/enrollments", {
        withCredentials: true,
      });

      setPendingRequests(
        res.data
          .filter((r) => r.status === "pending")
          .map((r) =>
            typeof r.courseId === "object" ? r.courseId._id : r.courseId
          )
      );
    } catch {
      setPendingRequests([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      milestones: form.milestones
        ? form.milestones.split(",").map((m) => m.trim())
        : [],
    };
    if (editing) {
      await axios.put(`/api/courses/${editing}`, payload, {
        withCredentials: true,
      });
    } else {
      await axios.post("/api/courses", payload, { withCredentials: true });
    }
    setForm({
      title: "",
      description: "",
      level: "",
      duration: "",
      media: "",
      milestones: "",
    });
    setEditing(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditing(course._id);
    setForm({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      media: course.media || "",
      milestones: course.milestones ? course.milestones.join(", ") : "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      await axios.delete(`/api/courses/${id}`, { withCredentials: true });
      fetchCourses();
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        `/api/user/enrollments`,
        { courseId },
        { withCredentials: true }
      );
      alert("Enrollment request sent!");
      setPendingRequests([...pendingRequests, courseId]);
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment request failed.");
    }
  };

  return (
    <div className="catalog">
      <Navbar />
      <div className="container">
        <h2>Course Catalog</h2>

        {user?.role === "admin" && (
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
              name="level"
              placeholder="Level"
              value={form.level}
              onChange={handleChange}
              required
              className="search-input"
            />
            <input
              name="duration"
              placeholder="Duration (hrs)"
              value={form.duration}
              onChange={handleChange}
              required
              className="search-input"
            />
            <input
              name="media"
              placeholder="Media URL (optional)"
              value={form.media}
              onChange={handleChange}
              className="search-input"
            />
            <input
              name="milestones"
              placeholder="Milestones (comma separated, optional)"
              value={form.milestones}
              onChange={handleChange}
              className="search-input"
            />
            <button className="btn" type="submit">
              {editing ? "Update" : "Add"} Course
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
                    level: "",
                    duration: "",
                    media: "",
                    milestones: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course._id} style={{ marginBottom: 10 }}>
                <strong>{course.title}</strong> ({course.level},{" "}
                {course.duration} hrs)
                <br />
                {course.description}
                <br />
                {course.media && (
                  <>
                    Media: <a href={course.media}>{course.media}</a>
                    <br />
                  </>
                )}
                {course.milestones && course.milestones.length > 0 && (
                  <>
                    Milestones: {course.milestones.join(", ")}
                    <br />
                  </>
                )}
                {user?.role === "admin" && (
                  <>
                    <button
                      className="btn"
                      onClick={() => handleEdit(course)}
                      style={{ marginRight: 10 }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(course._id)}
                      style={{ background: "#d9534f" }}
                    >
                      Delete
                    </button>
                  </>
                )}
                {user?.role === "employee" &&
                  (pendingRequests.includes(course._id) ? (
                    <span style={{ marginLeft: 10, color: "#888" }}>
                      Pending
                    </span>
                  ) : (
                    <button
                      className="btn"
                      onClick={() => handleEnroll(course._id)}
                      style={{ marginLeft: 10, background: "#28a745" }}
                    >
                      Enroll
                    </button>
                  ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
