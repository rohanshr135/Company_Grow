import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "",
    duration: "",
    mediaUrl: "",
    milestones: [""],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses", { withCredentials: true });
      setCourses(res.data);
    } catch {
      setCourses([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMilestoneChange = (idx, value) => {
    const milestones = [...form.milestones];
    milestones[idx] = value;
    setForm({ ...form, milestones });
  };

  const addMilestone = () => {
    setForm({ ...form, milestones: [...form.milestones, ""] });
  };

  const removeMilestone = (idx) => {
    const milestones = form.milestones.filter((_, i) => i !== idx);
    setForm({ ...form, milestones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        "/api/courses",
        {
          ...form,
          milestones: form.milestones.filter((m) => m.trim() !== ""),
        },
        { withCredentials: true }
      );
      setForm({
        title: "",
        description: "",
        level: "",
        duration: "",
        mediaUrl: "",
        milestones: [""],
      });
      fetchCourses();
    } catch (err) {
      setError("Failed to add course.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Manage Courses</h2>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 500, marginBottom: 30 }}
        >
          <div>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="search-input"
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="search-input"
            />
          </div>
          <div>
            <label>Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              required
              className="search-input"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label>Duration (e.g. 4 weeks, 10 hours)</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              className="search-input"
            />
          </div>
          <div>
            <label>Media URL (image/video)</label>
            <input
              name="mediaUrl"
              value={form.mediaUrl}
              onChange={handleChange}
              className="search-input"
              placeholder="https://example.com/media.jpg"
            />
          </div>
          <div>
            <label>Milestones</label>
            {form.milestones.map((milestone, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <input
                  value={milestone}
                  onChange={(e) => handleMilestoneChange(idx, e.target.value)}
                  className="search-input"
                  style={{ flex: 1 }}
                  placeholder={`Milestone ${idx + 1}`}
                />
                {form.milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(idx)}
                    style={{ marginLeft: 5 }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMilestone}
              style={{ marginTop: 5 }}
            >
              Add Milestone
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="btn" type="submit">
            Add Course
          </button>
        </form>
        <h3>All Courses</h3>
        <ul>
          {courses.map((course) => (
            <li key={course._id} style={{ marginBottom: 15 }}>
              <strong>{course.title}</strong> ({course.level})<br />
              Duration: {course.duration}
              <br />
              {course.mediaUrl && (
                <span>
                  Media:{" "}
                  <a
                    href={course.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {course.mediaUrl}
                  </a>
                  <br />
                </span>
              )}
              <span>Description: {course.description}</span>
              <br />
              {course.milestones && course.milestones.length > 0 && (
                <span>Milestones: {course.milestones.join(", ")}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
