"use client";

import { useState, useMemo } from "react";
import { Lecture, Quiz, QuizQuestion, Training } from "@/app/models/models";
import { renderMarkdown } from "@/utils/markdown";

interface CourseViewerProps {
    training: Training;
    lectures: Lecture[];
    quizes: Quiz[];
}

type SidebarItem =
    | { kind: "lecture"; data: Lecture; key: string }
    | { kind: "quiz"; data: Quiz; key: string };

function estimateMinutes(text?: string): number {
    if (!text) return 0;
    return Math.ceil(text.trim().split(/\s+/).length / 100);
}

// --- Quiz card ---
function QuizCard({ question, options }: QuizQuestion) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

// --- Lecture viewer ---
function LectureViewer({ lecture }: { lecture: Lecture }) {
    const minutes = estimateMinutes(lecture.description);
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {lecture.title}
                    </h2>
                    {minutes > 0 && (
                        <span className="text-xs text-gray-400 shrink-0">
                            {minutes} min read
                        </span>
                    )}
                </div>
                {lecture.tags && lecture.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
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
            <div
                className="text-sm text-gray-700 leading-relaxed overflow-x-auto break-words overflow-wrap-anywhere"
                dangerouslySetInnerHTML={{
                    __html: renderMarkdown(lecture.description ?? ""),
                }}
            />
        </div>
    );
}

// --- Quiz viewer ---
function QuizViewer({ quiz }: { quiz: Quiz }) {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-900">{quiz.name}</h2>
            <div className="flex flex-col gap-4">
                {quiz.content.map((q, i) => (
                    <QuizCard key={i} question={q.question} options={q.options} />
                ))}
            </div>
        </div>
    );
}

// --- Main component ---
export default function CourseViewer({
    training,
    lectures,
    quizes,
}: CourseViewerProps) {
    // Assign stable unique keys at the top, once, using index as fallback
    const sidebarItems: SidebarItem[] = useMemo(() => [
        ...lectures.map((l, i) => ({
            kind: "lecture" as const,
            data: { ...l, id: l.id ?? `lecture-${i}` },
            key: l.id ?? `lecture-${i}`,
        })),
        ...quizes.map((q, i) => ({
            kind: "quiz" as const,
            data: { ...q, id: q.id ?? `quiz-${i}` },
            key: q.id ?? `quiz-${i}`,
        })),
    ], [lectures, quizes]);

    const [selectedKey, setSelectedKey] = useState<string>(
        sidebarItems[0]?.key ?? ""
    );
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const selectedItem = sidebarItems.find((item) => item.key === selectedKey);
    const currentIndex = sidebarItems.findIndex((item) => item.key === selectedKey);
    const hasNext = currentIndex >= 0 && currentIndex < sidebarItems.length - 1;
    const isAllDone = currentIndex === sidebarItems.length - 1 && completed.has(selectedKey);

    const totalMinutes = lectures.reduce(
        (sum, l) => sum + estimateMinutes(l.description),
        0
    );
    const completedCount = completed.size;
    const progressPct =
        sidebarItems.length > 0
            ? Math.round((completedCount / sidebarItems.length) * 100)
            : 0;

    function handleSelect(key: string) {
        setSelectedKey(key);
    }

    function handleMarkComplete(key: string) {
        setCompleted((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    }

    function handleNext() {
        const next = sidebarItems[currentIndex + 1];
        if (!next) return;
        setCompleted((prev) => new Set(prev).add(selectedKey));
        setSelectedKey(next.key);
    }

    function handleFinish() {
        setCompleted((prev) => new Set(prev).add(selectedKey));
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            {/* Hero banner */}
            <div className="bg-gradient-to-r from-[#2f5074] to-[#44646c] w-full text-white px-12 py-8">
                <div className="max-w-[1200px] mx-auto flex flex-row gap-6 items-start">
                    {training.primary_image_url && (
                        <img
                            src={training.primary_image_url}
                            alt={training.name}
                            className="hidden sm:block w-[180px] h-[120px] object-cover rounded-xl shrink-0 border border-white/10 shadow-md"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    )}
                    <div className="flex flex-col gap-3 flex-1">
                        <h1 className="text-3xl font-medium">{training.name}</h1>
                        {training.subtitle && training.subtitle !== "No subtitle" && (
                            <p className="text-white/70 text-sm">{training.subtitle}</p>
                        )}
                        <div className="flex flex-row gap-6 mt-1">
                            <div className="flex flex-col gap-0.5 items-center">
                                <p className="text-lg font-bold">{lectures.length}</p>
                                <p className="uppercase text-xs text-white/60">lectures</p>
                            </div>
                            {quizes.length > 0 && (
                                <div className="flex flex-col gap-0.5 items-center">
                                    <p className="text-lg font-bold">{quizes.length}</p>
                                    <p className="uppercase text-xs text-white/60">quizzes</p>
                                </div>
                            )}
                            <div className="flex flex-col gap-0.5 items-center">
                                <p className="text-lg font-bold">{totalMinutes}</p>
                                <p className="uppercase text-xs text-white/60">min read</p>
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-light-teal rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                            <span className="text-xs text-white/60 shrink-0">
                                {completedCount}/{sidebarItems.length} completed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 max-w-[1200px] mx-auto w-full flex gap-6 px-6 py-8 items-start">

                {/* 30% sidebar */}
                <aside className="w-[30%] shrink-0 flex flex-col gap-2 sticky top-[72px] max-h-[calc(100vh-120px)] overflow-y-auto">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                        Contents
                    </p>
                    {sidebarItems.map((item) => {
                        const isSelected = selectedKey === item.key;
                        const isCompleted = completed.has(item.key);
                        const isLecture = item.kind === "lecture";
                        const title = isLecture
                            ? (item.data as Lecture).title ?? "Lecture"
                            : (item.data as Quiz).name;

                        return (
                            <button
                                key={item.key}
                                onClick={() => handleSelect(item.key)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-start gap-3 ${isSelected
                                    ? "border-light-teal bg-light-teal/5 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {/* Completion circle */}
                                <div
                                    className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${isCompleted
                                        ? "bg-light-teal border-light-teal"
                                        : isSelected
                                            ? "border-light-teal"
                                            : "border-gray-300"
                                        }`}
                                >
                                    {isCompleted && (
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path
                                                d="M1.5 4L3 5.5L6.5 2"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1 min-w-0">
                                    <span
                                        className={`text-xs font-medium leading-snug ${isCompleted
                                            ? "text-gray-400 line-through"
                                            : "text-gray-800"
                                            }`}
                                    >
                                        {title}
                                    </span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.5 rounded-md w-fit ${isLecture
                                            ? "bg-light-teal/10 text-light-teal"
                                            : "bg-yellow/10 text-yellow"
                                            }`}
                                    >
                                        {isLecture ? "Lecture" : "Quiz"}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </aside>

                {/* 70% content */}
                <main className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6 min-h-[500px] min-w-0">
                    {selectedItem ? (
                        <>
                            {selectedItem.kind === "lecture" ? (
                                <LectureViewer lecture={selectedItem.data as Lecture} />
                            ) : (
                                <QuizViewer quiz={selectedItem.data as Quiz} />
                            )}

                            {/* Bottom actions */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                                <button
                                    onClick={() => handleMarkComplete(selectedKey)}
                                    className={`text-xs px-4 py-2 rounded-xl border transition-all ${completed.has(selectedKey)
                                        ? "border-light-teal bg-light-teal/10 text-light-teal"
                                        : "border-gray-200 text-gray-500 hover:border-light-teal hover:text-light-teal"
                                        }`}
                                >
                                    {completed.has(selectedKey) ? "✓ Completed" : "Mark as complete"}
                                </button>

                                {hasNext ? (
                                    <button
                                        onClick={handleNext}
                                        className="text-xs px-4 py-2 rounded-xl bg-brand-gradient text-white font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Next →
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFinish}
                                        disabled={isAllDone}
                                        className="text-xs px-4 py-2 rounded-xl bg-brand-gradient text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isAllDone ? "✓ Course complete" : "Finish course"}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">
                            Select a section to start learning
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}