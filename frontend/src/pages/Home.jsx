import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <div className="container">
        <h2>Welcome to CompanyGrow</h2>
        <p>
          Experience seamless training and teamwork.
          <br />
          Login or sign up to access your dashboard.
        </p>
        <div style={{ marginTop: 20 }}>
          <Link
            to="/login"
            className="btn"
            style={{ marginRight: 10, display: "inline-block" }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn"
            style={{ display: "inline-block" }}
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
