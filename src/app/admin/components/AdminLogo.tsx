"use client";

import Link from "next/link";
import Image from "next/image";

export default function AdminLogo() {
  return (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/miCoach_logo.png"
        alt="miCoach"
        width={100}
        height={100}
        className="w-auto object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <span className="text-xs px-2 py-0.5 rounded-full bg-light-teal/10 text-light-teal border border-light-teal/20 font-medium">
        Admin
      </span>
    </Link>
  );
}
