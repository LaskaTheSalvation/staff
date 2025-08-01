import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_STAFF = {
  username: "staff",
  password: "staff123",
};

const StaffLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === DUMMY_STAFF.username && password === DUMMY_STAFF.password) {
      localStorage.setItem("isStaffLoggedIn", "true"); // SIMPAN STATUS LOGIN
      navigate("/staff");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f3f4f6"
    }}>
      <form 
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "2rem 2.5rem",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)"
        }}
      >
        <h2 style={{ marginBottom: 24, textAlign: "center" }}>Staff Login</h2>
        <div style={{ marginBottom: 18 }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder="Masukkan username"
            onChange={e => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6, borderRadius: 6, border: "1px solid #e5e7eb" }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Masukkan password"
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 6, borderRadius: 6, border: "1px solid #e5e7eb" }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 14 }}>{error}</div>}
        <button 
          type="submit"
          style={{
            width: "100%",
            padding: "10px 0",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontWeight: "bold",
            letterSpacing: 1
          }}
        >Login</button>
      </form>
    </div>
  );
};

export default StaffLogin;
