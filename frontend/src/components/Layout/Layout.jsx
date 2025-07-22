import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

// Import halaman-halaman yang akan digunakan di dalam layout staff
import Home from "../../Pages/staff/induk/Home";
import Placeholder from "../../Pages/PlaceHolder";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen text-[var(--color-bg-light)] dark:text-[var(--color-text-light)] font-body">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col flex-1 min-w-0 md:pl-72">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-light)] p-4 sm:p-6">
          {/* Rute-rute spesifik untuk halaman staff */}
          <Routes>
            {/* Redirect dari /staff ke /staff/home sebagai halaman default */}
            <Route path="/" element={<Navigate to="/staff/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us" element={<Placeholder title="About Us" />} />
            <Route path="/media" element={<Placeholder title="Media" />} />
            <Route path="/service" element={<Placeholder title="Service" />} />
            <Route path="/contact" element={<Placeholder title="Contact" />} />
            <Route path="/halaman" element={<Placeholder title="Halaman" />} />
            
            {/* Rute fallback jika halaman tidak ditemukan di dalam area staff */}
            <Route path="*" element={<Placeholder title="404 - Halaman Tidak Ditemukan" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
