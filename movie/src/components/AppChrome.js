"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AppChrome({ children }) {
  return (
    <div className="app-shell">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
