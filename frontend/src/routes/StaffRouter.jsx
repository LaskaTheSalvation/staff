import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutUs from "../pages/staff/induk/AboutUs";
import Contacts from "../pages/staff/induk/Contacts";
import Home from "../pages/staff/induk/Home";
import Media from "../pages/staff/induk/Media";
import Service from "../pages/staff/induk/Service";

const StaffRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="aboutus" element={<AboutUs />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="media" element={<Media />} />
    <Route path="service" element={<Service />} />
  </Routes>
);

export default StaffRouter;
