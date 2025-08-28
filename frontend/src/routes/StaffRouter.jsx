import React from "react";
import { Routes, Route } from "react-router-dom";
import AboutUs from "../Pages/staff/induk/AboutUs";
import Contacts from "../Pages/staff/induk/Contacts";
import Home from "../Pages/staff/induk/Home";
import Media from "../Pages/staff/induk/Media";
import Service from "../Pages/staff/induk/Service";

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
