import { Metadata } from "next";
import RegisterContainer from "@/features/auth/register/containers/RegisterContainer";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Arteri baru dan bergabunglah dengan komunitas kami.",
};

export default function RegisterPage() {
  return <RegisterContainer />;
}
