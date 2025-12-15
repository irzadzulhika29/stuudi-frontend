"use client";

import Navbar from "@/features/auth/components/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterSection from "@/features/auth/components/RegisterSection";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <RegisterSection />
      <Footer />
    </>
  );
}
