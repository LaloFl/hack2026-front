// app/admin/components/AdminLogo.tsx
"use client";

import Link from "next/link";

export default function AdminLogo() {
    return (
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <img
                src="/logo.png"
                alt="miCoach"
                className="h-7 w-auto object-contain"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                }}
            />
            <span className="text-sm font-semibold text-gray-800">miCoach</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-light-teal/10 text-light-teal border border-light-teal/20 font-medium">
                Admin
            </span>
        </Link>
    );
}