import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CourseCatalog from "./pages/CourseCatalog";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AdminCourses from "./pages/AdminCourses";
import AdminEnrollmentRequests from "./pages/AdminEnrollmentRequests";
import AdminProjectCompletions from "./pages/AdminProjectCompletions";
import Signup from "./pages/Signup";
import Login from "./pages/login.jsx";
import { useAuth } from "./contexts/AuthContext";
import AdminProjects from "./pages/AdminProjects";
import "./App.css";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CourseCatalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enrollment-requests"
          element={
            <ProtectedRoute adminOnly>
              <AdminEnrollmentRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute adminOnly>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute adminOnly>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute adminOnly>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/project-completions"
          element={
            <ProtectedRoute adminOnly>
              <AdminProjectCompletions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
