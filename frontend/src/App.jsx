import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import StaffLogin from "./Pages/login/StaffLogin";
import StaffRoutes from "./routes/StaffRouter";
import ProtectedRoute from "./routes/ProtectedRoute"; // Tambahkan ini

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route untuk halaman login staff */}
        <Route path="/login/staff" element={<StaffLogin />} />

        {/* Route untuk landing page publik */}
        <Route path="/" element={<div>Halaman Landing Page Publik</div>} />

        {/* Semua halaman untuk staff, sekarang diproteksi */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<StaffRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
