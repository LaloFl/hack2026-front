// app/admin/components/AdminLogo.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function RoleLogo() {
  let role = "User";
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    role = "Admin";
  }
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
        {role}
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
        <RoleLogo />
        <div className="flex flex-row gap-4">
          <Link
            href="/admin/dashboard"
            className="text-xs font-medium text-gray-500 hover:text-light-teal transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="text-xs font-medium text-gray-500 hover:text-light-teal transition-colors"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
