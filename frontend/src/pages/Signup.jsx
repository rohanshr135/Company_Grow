import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    skills: "",
    experience: "",
    profileImage: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Convert skills to array if provided
      const payload = {
        ...form,
        skills: form.skills
          ? form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      await axios.post("/api/auth/signup", payload, { withCredentials: true });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="home">
      <Navbar />
      <div className="container">
        <h2>Signup</h2>
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
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="search-input"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="search-input"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="search-input"
              minLength={6}
            />
          </div>
          <div>
            <label>Skills (comma separated, optional)</label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="search-input"
              placeholder="e.g. React, Node.js"
            />
          </div>
          <div>
            <label>Experience (optional)</label>
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="search-input"
              placeholder="e.g. 3 years"
            />
          </div>
          <div>
            <label>Profile Image URL (optional)</label>
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
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
