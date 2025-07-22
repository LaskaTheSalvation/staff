import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";

const App = () => {
  return (
    <Router>
      {/*
        Struktur routing utama.
        - Rute untuk halaman login bisa ditambahkan di sini (di luar Layout).
        - Semua rute yang memerlukan Sidebar dan Navbar dibungkus oleh komponen Layout.
      */}
      <Routes>
        {/* Rute untuk halaman login atau landing page publik bisa diletakkan di sini */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/" element={<div>Halaman Landing Page Publik</div>} />
        
        {/* Semua halaman untuk staff akan berada di bawah /staff dan menggunakan Layout */}
        <Route path="/staff/*" element={<Layout />} />
      </Routes>
    </Router>
  );
};

export default App;
