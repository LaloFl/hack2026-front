"use client";

import Image from "next/image";
import Link from "next/link";

export default function CoursesLogo() {
    return (
        <Link href="/courses" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
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
        </Link>
    );
}