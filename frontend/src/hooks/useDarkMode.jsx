import { useEffect } from "react";

const useDarkMode = () => {
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = localStorage.getItem("theme");

    const isDark = theme === "dark" || (!theme && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
};

export default useDarkMode;
