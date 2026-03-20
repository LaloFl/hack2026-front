"use client";

import { useRouter } from "next/navigation";

interface Training {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    trainingUrl: string;
}

// Replace with your real API call
const MOCK_TRAININGS: Training[] = [
    {
        id: "1",
        slug: "intro-to-typescript",
        title: "Introduction to TypeScript",
        description: "Learn the fundamentals of TypeScript, including types, interfaces, and how to migrate an existing JavaScript project to TypeScript with confidence.",
        imageUrl: "/placeholder-training.jpg",
        trainingUrl: "https://micoach.example.com/trainings/intro-to-typescript",
    },
    {
        id: "2",
        slug: "react-hooks-deep-dive",
        title: "React Hooks Deep Dive",
        description: "A comprehensive look at React hooks from useState and useEffect to custom hooks, context, and performance optimization patterns used in production apps.",
        imageUrl: "/placeholder-training.jpg",
        trainingUrl: "https://micoach.example.com/trainings/react-hooks-deep-dive",
    },
    {
        id: "3",
        slug: "node-rest-apis",
        title: "Building REST APIs with Node.js",
        description: "Design and build scalable REST APIs using Node.js and Express. Covers routing, middleware, authentication, error handling, and deployment best practices.",
        imageUrl: "/placeholder-training.jpg",
        trainingUrl: "https://micoach.example.com/trainings/node-rest-apis",
    },
    {
        id: "4",
        slug: "css-layout-mastery",
        title: "CSS Layout Mastery",
        description: "Master modern CSS layout techniques including Flexbox, Grid, container queries, and responsive design patterns that work across all modern browsers.",
        imageUrl: "/placeholder-training.jpg",
        trainingUrl: "https://micoach.example.com/trainings/css-layout-mastery",
    },
    {
        id: "5",
        slug: "docker-for-developers",
        title: "Docker for Developers",
        description: "Get hands-on with Docker containers, images, volumes, and networking. Learn how to containerize your apps and set up local development environments.",
        imageUrl: "/placeholder-training.jpg",
        trainingUrl: "https://micoach.example.com/trainings/docker-for-developers",
    },
    {
        id: "6",
        slug: "git-workflows",
        title: "Git Workflows for Teams",
        description: "Explore Git branching strategies, pull request workflows, rebasing, conflict resolution, and how to maintain a clean commit history in collaborative projects.",
        imageUrl: "/placeholder-training.jpg",
        trainingUrl: "https://micoach.example.com/trainings/git-workflows",
    },
];

function TrainingCard({ training }: { training: Training }) {
    const router = useRouter();

    return (
        <div className="w-[300px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md">

            {/* Header image */}
            <div className="h-[160px] bg-gray-100 overflow-hidden relative">
                <img
                    src={training.imageUrl}
                    alt={training.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
                {/* Fallback gradient when no image */}
                <div className="absolute inset-0 bg-brand-gradient opacity-20 pointer-events-none" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-3">
                <div className="flex flex-col gap-1 flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 leading-snug">
                        {training.title}
                    </h2>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {training.description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                    <button
                        onClick={() => router.push(`/admin/create/${training.slug}`)}
                        className="w-full py-2 rounded-xl bg-brand-gradient text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                        ✦ Create lecture
                    </button>
                    <a
                        href={training.trainingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:border-gray-300 hover:text-gray-700 transition-all text-center"
                    >
                        Go to training ↗
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="flex justify-center items-start p-6 w-full min-h-screen bg-gray-50">
            <div className="max-w-[960px] min-w-[350px] w-full flex flex-col gap-6">

                {/* Header */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Admin</p>
                        <h1 className="text-base font-semibold text-gray-800">Available trainings</h1>
                    </div>
                    <span className="text-xs bg-light-teal/10 text-light-teal border border-light-teal/20 rounded-full px-3 py-1">
                        {MOCK_TRAININGS.length} trainings
                    </span>
                </div>

                {/* Cards grid */}
                <div className="flex flex-wrap gap-4">
                    {MOCK_TRAININGS.map((training) => (
                        <TrainingCard key={training.id} training={training} />
                    ))}
                </div>

            </div>
        </div>
    );
}