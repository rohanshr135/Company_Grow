import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useAuth } from "../contexts/AuthContext";
Chart.register(BarElement, CategoryScale, LinearScale);

export default function Analytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    new Date().getFullYear(),
  ]);

  useEffect(() => {
    if (user?.role === "admin") {
      axios
        .get("/api/admin/users", { withCredentials: true })
        .then((res) => setEmployees(res.data))
        .catch(() => setEmployees([]));
    }
  }, [user]);

  useEffect(() => {
    let url = `/api/analytics/employee?year=${year}`;
    if (user?.role === "admin" && selected) {
      url += `&userId=${selected}`;
    }
    if (
      user &&
      (user.role === "employee" || (user.role === "admin" && selected))
    ) {
      axios
        .get(url, { withCredentials: true })
        .then((res) => {
          setStats(res.data);
          if (res.data.availableYears)
            setAvailableYears(res.data.availableYears.sort((a, b) => b - a));
        })
        .catch(() => setStats(null));
    }
  }, [user, selected, year]);

  if (!user) return <div>Loading...</div>;

  const projectOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Projects Completed",
        },
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  const courseOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Courses Completed",
        },
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return (
    <div className="analytics">
      <Navbar />
      <div className="container">
        <h2>Performance Analytics</h2>
        {user.role === "admin" && (
          <div style={{ marginBottom: 20 }}>
            <label>
              Select Employee:{" "}
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                style={{ minWidth: 200 }}
              >
                <option value="">-- Select --</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label>
            Select Year:{" "}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{ minWidth: 120 }}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
        {!stats ? (
          <div>No analytics data available.</div>
        ) : (
          <>
            <ul>
              <li>
                <strong>Name:</strong> {stats.name}
              </li>
              <li>
                <strong>Total Rewards:</strong> $
                {stats.totalRewards?.toFixed(2) ?? "0.00"}
              </li>
              <li>
                <strong>Assigned Projects:</strong> {stats.assignedProjects}
              </li>
              <li>
                <strong>Completed Projects:</strong> {stats.completedProjects}
              </li>
              <li>
                <strong>Enrolled Courses:</strong> {stats.enrolledCourses}
              </li>
            </ul>
            <div style={{ maxWidth: 600, margin: "2rem auto" }}>
              <Bar
                data={{
                  labels: stats.monthlyProjectPerf?.map((m) => m.month) || [],
                  datasets: [
                    {
                      label: "Project Completions",
                      data: stats.monthlyProjectPerf?.map((m) => m.value) || [],
                      backgroundColor: "#007bff",
                    },
                  ],
                }}
                options={projectOptions}
              />
            </div>
            <div style={{ maxWidth: 600, margin: "2rem auto" }}>
              <Bar
                data={{
                  labels: stats.monthlyCoursePerf?.map((m) => m.month) || [],
                  datasets: [
                    {
                      label: "Course Completions",
                      data: stats.monthlyCoursePerf?.map((m) => m.value) || [],
                      backgroundColor: "#28a745",
                    },
                  ],
                }}
                options={courseOptions}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
