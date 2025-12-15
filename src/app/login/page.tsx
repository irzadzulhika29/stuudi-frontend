"use client";

import Navbar from "@/features/auth/components/Navbar";
import Footer from "@/components/layout/Footer";
import LoginSection from "@/features/auth/components/LoginSection";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <LoginSection />
      <Footer />
    </>
  );
}
