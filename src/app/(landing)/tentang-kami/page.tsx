import { notFound } from "next/navigation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - Arteri",
  description:
    "Kenali lebih dekat Arteri, platform pembelajaran dan olimpiade pertama di Indonesia.",
};

export default function TentangKamiPage() {
  notFound();
}
