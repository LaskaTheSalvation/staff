import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Pastikan path ini sesuai dengan struktur proyek Anda
import "./index.css"; // Pastikan ini diimpor

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);