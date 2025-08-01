import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

// Import halaman-halaman yang akan digunakan di dalam layout staff
import Home from "../../Pages/staff/induk/Home";
import AboutUs from "../../Pages/staff/induk/AboutUs";
import Media from "../../Pages/staff/induk/Media";
import Service from "../../Pages/staff/induk/Service";
import Contact from "../../Pages/staff/induk/Contacts";
import Halaman from "../../Pages/staff/induk/Halaman"; // Halaman yang berisi DaftarHalamanCard
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
          {/* Rute-rute ini relatif terhadap path induk '/staff/*' */}
          <Routes>
            {/* Redirect dari /staff ke /staff/halaman sebagai halaman default */}
            <Route index element={<Navigate to="halaman" replace />} />
            
            {/* Rute untuk halaman utama yang menampilkan daftar halaman */}
            <Route path="halaman" element={<Halaman />} />

            {/* Rute untuk mengedit setiap halaman spesifik */}
            <Route path="home" element={<Home />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="media" element={<Media />} />
            <Route path="service" element={<Service />} />
            <Route path="contact" element={<Contact />} />
            
            {/* Rute fallback jika halaman tidak ditemukan di dalam area staff */}
            <Route path="*" element={<Placeholder title="404 - Halaman Tidak Ditemukan" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
