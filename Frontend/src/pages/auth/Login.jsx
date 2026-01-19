import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE 👉", res.data);

      /**
       * ✅ EXPECTED BACKEND RESPONSE
       * {
       *   token: "...",
       *   user: { _id, name, email, role }
       * }
       */
      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ CLEAR OLD SESSION
      localStorage.clear();

      // ✅ STORE AUTH DATA (THIS FIXES EVERYTHING)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🚀 REDIRECT BASED ON ROLE
      if (user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/client/dashboard", { replace: true });
      }

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        {error && (
          <p style={{ color: "red", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">© 2026 RealEstate CRM</p>
      </div>
    </div>
  );
};

export default Login;
