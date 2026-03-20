"use client";

import { useState } from "react";

interface QuizQuestion {
    question: string;
    options: { text: string; correct: boolean }[];
}

function QuizCard({ question, options }: QuizQuestion) {
    const [selected, setSelected] = useState<number | null>(null);

    const getStyle = (index: number, correct: boolean) => {
        if (selected === null) return "border-gray-200 hover:border-dark-teal";
        if (index === selected && correct) return "border-light-teal bg-light-teal/10 text-light-teal";
        if (index === selected && !correct) return "border-red-400 bg-red-50 text-red-600";
        if (correct) return "border-light-teal bg-light-teal/10 text-light-teal"; // reveal correct
        return "border-gray-100 opacity-50";
    };

    return (
        <div className="flex flex-col gap-3 p-5 rounded-2xl border border-gray-200 bg-white">
            <p className="text-sm font-semibold text-gray-800">{question}</p>
            <div className="flex flex-col gap-2">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        disabled={selected !== null}
                        onClick={() => setSelected(i)}
                        className={`text-left px-4 py-2 rounded-xl border text-sm transition-all ${getStyle(i, opt.correct)}`}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
            {selected !== null && (
                <p className={`text-xs font-medium ${options[selected].correct ? "text-light-teal" : "text-red-500"}`}>
                    {options[selected].correct ? "✓ Correct!" : `✗ The correct answer was: ${options.find(o => o.correct)?.text}`}
                </p>
            )}
        </div>
    );
}

export function QuizRenderer({ markdown }: { markdown: string }) {
    const questions = parseQuizMarkdown(markdown);

    return (
        <div className="flex flex-col gap-4">
            {questions.map((q, i) => (
                <QuizCard key={i} {...q} />
            ))}
        </div>
    );
}