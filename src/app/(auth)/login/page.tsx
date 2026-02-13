import { Metadata } from "next";
import LoginContainer from "@/features/auth/login/containers/LoginContainer";

export const metadata: Metadata = {
  title: "Login - Stuudi Learning Platform",
  description:
    "Masuk ke akun Stuudi Anda untuk mengakses kursus, materi pembelajaran, dan ujian online. Platform pembelajaran modern untuk siswa dan tim.",
  keywords: [
    "login stuudi",
    "masuk stuudi",
    "platform pembelajaran",
    "e-learning",
    "kursus online",
  ],
  openGraph: {
    title: "Login - Stuudi Learning Platform",
    description:
      "Akses kursus dan materi pembelajaran di Stuudi. Platform e-learning modern untuk meningkatkan skill Anda.",
    type: "website",
    locale: "id_ID",
    siteName: "Stuudi",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginContainer />;
}
