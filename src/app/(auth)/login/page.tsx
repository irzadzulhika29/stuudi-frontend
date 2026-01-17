import { Metadata } from "next";
import LoginContainer from "@/features/auth/login/containers/LoginContainer";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Arteri Anda untuk mulai belajar.",
};

export default function LoginPage() {
  return <LoginContainer />;
}
