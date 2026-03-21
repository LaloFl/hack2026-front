// import Link from "next/link";
// import CoursesLogo from "./components/CoursesLogo";

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
        // <div className="min-h-screen bg-gray-50 flex flex-col">
        //     <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
        //         <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
        //             <CoursesLogo />
        //             <Link
        //                 href="/courses"
        //                 className="text-xs font-medium text-gray-500 hover:text-light-teal transition-colors"
        //             >
        //                 ← Home
        //             </Link>
        //         </div>
        //     </header>
        //     <main className="flex-1">
        //         {children}
        //     </main>
        // </div>
    );
}