// src/pages/Placeholder.jsx
import React from "react";

const Placeholder = ({ title }) => {
  return (
    <div className="text-center mt-20 text-gray-400 text-lg font-medium">
      Halaman <span className="text-black font-bold">{title}</span> masih dalam pengembangan...
    </div>
  );
};

export default Placeholder;
