import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

import Home from "./Pages/Home";
import Placeholder from "./Pages/PlaceHolder";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Router>
      <div className="flex h-screen bg-light">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex flex-col flex-1 overflow-hidden md:pl-72">
          <Navbar toggleSidebar={toggleSidebar} />

          <main className="p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<Placeholder title="About Us" />} />
              <Route path="/media" element={<Placeholder title="Media" />} />
              <Route path="/service" element={<Placeholder title="Service" />} />
              <Route path="/contact" element={<Placeholder title="Contact" />} />
              <Route path="/halaman" element={<Placeholder title="Halaman" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
