"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDark(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  function changeTheme() {
    const nextTheme = !isDark;

    setIsDark(nextTheme);

    if (nextTheme) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button className="theme-button" onClick={changeTheme} aria-label="Change theme">
      {isDark ? "☀" : "☾"}
    </button>
  );
}
