// src/pages/Placeholder.jsx
import React from "react";
import APITestComponent from "../components/APITestComponent";

const Placeholder = ({ title }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">
          This is a placeholder page for {title}. The backend API is now fully implemented and ready to serve content.
        </p>
      </div>
      
      {/* API Integration Test */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Backend API Integration Test</h2>
          <p className="text-sm text-gray-600 mt-1">
            Live data from Django REST API backend
          </p>
        </div>
        <APITestComponent />
      </div>
    </div>
  );
};

export default Placeholder;
