import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    async function fetchProfileImage() {
      if (user) {
        try {
          // Get latest profile info (only image)
          const res = await axios.get("/api/user/profile", {
            withCredentials: true,
          });
          setProfileImage(res.data.profileImage);
        } catch {
          setProfileImage("");
        }
      }
    }
    fetchProfileImage();
  }, [user]);

  // Handler for clicking the profile image
  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  return (
    <>
      {/* CompanyGrow heading at the very top */}
      <div
        style={{
          width: "100%",
          background: "#222",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 28,
          letterSpacing: 1,
          padding: "12px 0 8px 0",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        CompanyGrow
      </div>
      <nav
        className="navbar"
        style={{
          background: "#007bff",
          color: "#fff",
          padding: "10px 0",
          position: "sticky",
          top: 56, // height of the CompanyGrow bar
          zIndex: 1099,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <ul
              className="nav-links"
              style={{
                display: "flex",
                alignItems: "center",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {user ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      style={{ color: "#fff", margin: "0 10px" }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  {/* Removed Courses link */}
                  {/* Removed Profile link */}
                  <li>
                    <Link
                      to="/analytics"
                      style={{ color: "#fff", margin: "0 10px" }}
                    >
                      Analytics
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <>
                      <li>
                        <Link
                          to="/admin/courses"
                          style={{ color: "#fff", margin: "0 10px" }}
                        >
                          Manage Courses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/projects"
                          style={{ color: "#fff", margin: "0 10px" }}
                        >
                          Manage Projects
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/enrollment-requests"
                          style={{ color: "#fff", margin: "0 10px" }}
                        >
                          Enrollment Requests
                        </Link>
                      </li>
                    </>
                  )}
                  {/* Logout button removed from navbar */}
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" style={{ color: "#fff", margin: "0 10px" }}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      style={{ color: "#fff", margin: "0 10px" }}
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {/* User profile image on the right, click to go to profile */}
            {user && (
              <img
                src={profileImage || "https://ui-avatars.com/api/?name=User"}
                alt="Profile"
                onClick={handleProfileClick}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                  marginLeft: 18,
                  boxShadow: "0 0 4px #0002",
                  background: "#fff",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
