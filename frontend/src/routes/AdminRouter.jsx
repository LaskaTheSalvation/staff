import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AdminHome from '../Pages/admin/Home';

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AdminHome />} />
        <Route path="about-us" element={<AdminHome />} />
        <Route path="media" element={<AdminHome />} />
        <Route path="service" element={<AdminHome />} />
        <Route path="contact" element={<AdminHome />} />
        <Route path="halaman" element={<AdminHome />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
