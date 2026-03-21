"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lecture, Quiz, QuizQuestion, Training } from "@/app/models/models";
import { renderMarkdown } from "@/utils/markdown";

interface PreviewClientProps {
    training: Training;
    lectures: Lecture[];
    quizes: Quiz[];
}

function estimateMinutes(text?: string): number {
    if (!text) return 0;
    return Math.ceil(text.trim().split(/\s+/).length / 100);
}

function LectureDropdown({ lecture, index }: { lecture: Lecture; index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const minutes = estimateMinutes(lecture.description);

    return (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                        {lecture.title ?? `Lecture ${index + 1}`}
                    </span>
                    {minutes > 0 && (
                        <span className="text-xs text-gray-400 shrink-0">{minutes} min</span>
                    )}
                </div>
                <span className="text-gray-400 text-sm shrink-0 ml-2">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {isOpen && (
                <div className="border-t border-gray-100">
                    {/* Rendered markdown body */}
                    <div
                        className="px-5 py-4 text-sm text-gray-700 leading-relaxed prose-headings:font-semibold prose-headings:text-gray-900"
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(lecture.description ?? ""),
                        }}
                    />

                    {/* Tags */}
                    {lecture.tags && lecture.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 px-5 pb-4">
                            {lecture.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function QuizCard({ question, options }: QuizQuestion) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Normalize is_correct — backend may send "true"/"false" strings instead of booleans
    const normalizedOptions = options.map((o) => ({
        ...o,
        is_correct: o.is_correct === true || (o as any).is_correct === "true",
    }));

    const correctIndex = normalizedOptions.findIndex((o) => o.is_correct);
    const userWasCorrect =
        selectedIndex !== null && selectedIndex === correctIndex;

    function getStyle(index: number): string {
        if (selectedIndex === null)
            return "border-gray-200 hover:border-dark-teal cursor-pointer";

        if (index === selectedIndex)
            return index === correctIndex
                ? "border-light-teal bg-light-teal/10 text-light-teal"
                : "border-red-400 bg-red-50 text-red-600";

        if (!userWasCorrect && index === correctIndex)
            return "border-light-teal bg-light-teal/10 text-light-teal";

        return "border-gray-100 opacity-40";
    }

    return (
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-white">
            <p className="text-sm font-semibold text-gray-800">{question}</p>
            <div className="flex flex-col gap-2">
                {normalizedOptions.map((opt, i) => (
                    <button
                        key={i}
                        disabled={selectedIndex !== null}
                        onClick={() => setSelectedIndex(i)}
                        className={`text-left px-4 py-2 rounded-xl border text-sm transition-all ${getStyle(i)}`}
                    >
                        {opt.option}
                    </button>
                ))}
            </div>
            {selectedIndex !== null && (
                <p className={`text-xs font-medium ${userWasCorrect ? "text-light-teal" : "text-red-500"}`}>
                    {userWasCorrect
                        ? "✓ Correct!"
                        : `✗ Correct answer: ${normalizedOptions[correctIndex]?.option}`}
                </p>
            )}
        </div>
    );
}

function QuizBlock({ quiz }: { quiz: Quiz }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-xl border border-yellow/30 bg-yellow/5 overflow-hidden">
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow/10 text-yellow border border-yellow/30 font-medium">
                        Quiz
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{quiz.name}</span>
                    <span className="text-xs text-gray-400">
                        {quiz.content.length} question{quiz.content.length !== 1 ? "s" : ""}
                    </span>
                </div>
                <span className="text-gray-400 text-sm">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className="px-5 pb-5 flex flex-col gap-3 border-t border-yellow/20 pt-4">
                    {quiz.content.map((q, i) => (
                        <QuizCard key={i} question={q.question} options={q.options} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PreviewClient({
    training,
    lectures,
    quizes,
}: PreviewClientProps) {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);

    const totalMinutes = lectures.reduce(
        (sum, l) => sum + estimateMinutes(l.description),
        0
    );

    async function handlePublish() {
        setIsPublishing(true);
        try {
            // TODO: publish endpoint
            // await fetch("http://localhost:8000/publish", { method: "POST", ... })
            await new Promise((r) => setTimeout(r, 1000));
            router.push("/admin/dashboard");
        } catch (err) {
            console.error("Publish failed:", err);
        } finally {
            setIsPublishing(false);
        }
    }

    return (
        <main className="w-full min-h-screen bg-gray-100 flex flex-col gap-8 items-start">

            {/* Hero banner */}
            <div className="bg-gradient-to-r from-[#2f5074] to-[#44646c] w-full flex flex-col gap-4 text-white px-12 py-8">

                <div className="flex flex-row gap-6 items-start w-full">

                    {/* Thumbnail from MOCK_TRAININGS */}
                    {training.primary_image_url && (
                        <img
                            src={training.primary_image_url}
                            alt={training.name}
                            className="hidden sm:block w-[200px] h-[130px] object-cover rounded-xl shrink-0 border border-white/10 shadow-md"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    )}

                    <div className="flex flex-col gap-3 flex-1">
                        <h1 className="text-4xl font-medium">{training.name}</h1>

                        {training.subtitle && training.subtitle !== "No subtitle" && (
                            <p className="text-white/80 text-base">{training.subtitle}</p>
                        )}

                        {/* Stats row */}
                        <div className="flex flex-row gap-6 mt-2">
                            <div className="flex flex-col gap-0.5 items-center">
                                <p className="text-[--secondary-2] text-lg font-bold">
                                    {lectures.length}
                                </p>
                                <p className="uppercase text-xs text-white/60">lectures</p>
                            </div>
                            {quizes.length > 0 && (
                                <div className="flex flex-col gap-0.5 items-center">
                                    <p className="text-[--secondary-2] text-lg font-bold">
                                        {quizes.length}
                                    </p>
                                    <p className="uppercase text-xs text-white/60">quizzes</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-0.5 items-center">
                                <p className="text-[--secondary-2] text-lg font-bold">
                                    {totalMinutes}
                                </p>
                                <p className="uppercase text-xs text-white/60">min read</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full flex flex-col gap-4 px-12 pb-24">

                {/* Lectures */}
                {lectures.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Lectures
                        </p>
                        {lectures.map((lecture, index) => (
                            <LectureDropdown
                                key={lecture.id ?? index}
                                lecture={lecture}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Quizzes */}
                {quizes.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Quizzes
                        </p>
                        {quizes.map((quiz, index) => (
                            <QuizBlock key={quiz.id ?? index} quiz={quiz} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {lectures.length === 0 && quizes.length === 0 && (
                    <div className="flex items-center justify-center py-20 text-gray-300 text-sm">
                        No content to preview yet.
                    </div>
                )}
            </div>

            {/* Publish FAB */}
            <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="fixed bottom-5 right-5 rounded-full border border-transparent flex items-center justify-center bg-[--primary-2] text-white gap-2 hover:bg-[--primary-2-hover] hover:-translate-y-1 transform transition disabled:opacity-60 disabled:cursor-not-allowed text-sm h-12 px-10 shadow-lg"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 2L3 8l4 2 2 4 4-12z" fill="white" />
                </svg>
                {isPublishing ? "Publishing..." : "Publish"}
            </button>
        </main>
    );
}