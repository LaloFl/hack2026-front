"use client";

import { Quiz } from "@/app/models/models";
import { useState } from "react";

function toBoolean(value: unknown): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.trim().toLowerCase() === "true";
    if (typeof value === "number") return value === 1;
    return false;
}

export default function QuizDisplay({ quiz }: { quiz: Quiz }) {
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [finished, setFinished] = useState(false);

    const total = quiz.content.length;
    const question = quiz.content[currentQ];
    const progress = ((currentQ + (revealed ? 1 : 0)) / total) * 100;

    const score = Object.entries(answers).filter(([qi, opt]) => {
        const q = quiz.content[parseInt(qi)];
        return toBoolean(q.options.find((o) => o.option === opt)?.is_correct);
    }).length;

    function handleSelect(opt: any) {
        if (revealed) return;
        setSelected(opt.option);
    }

    function handleReveal() {
        if (!selected) return;
        setRevealed(true);
        setAnswers((prev) => ({ ...prev, [currentQ]: selected }));
    }

    function handleNext() {
        if (currentQ + 1 >= total) {
            setFinished(true);
        } else {
            setCurrentQ((q) => q + 1);
            setSelected(null);
            setRevealed(false);
        }
    }

    function handleRestart() {
        setCurrentQ(0);
        setSelected(null);
        setRevealed(false);
        setAnswers({});
        setFinished(false);
    }

    interface OptionStyleParams {
        option: string;
        is_correct: unknown;
    }

    const optionStyle = (opt: OptionStyleParams): string => {
        const base =
            "relative w-full text-left px-4 py-2 rounded-xl border text-sm transition-all duration-200 focus:outline-none";
        if (!revealed) {
            return selected === opt.option
                ? `${base} border-dark-teal bg-dark-teal/10 text-dark-teal cursor-pointer`
                : `${base} border-gray-200 text-gray-700 hover:border-dark-teal cursor-pointer`;
        }
        if (toBoolean(opt.is_correct))
            return `${base} border-light-teal bg-light-teal/10 text-light-teal`;
        if (selected === opt.option && !toBoolean(opt.is_correct))
            return `${base} border-red-400 bg-red-50 text-red-600`;
        return `${base} border-gray-100 text-gray-400 opacity-40`;
    };

    return (
        <div className="flex items-center justify-center p-4 sm:p-6 bg-gray-50 rounded-xl">
            <div className="w-full max-w-2xl">
                <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                        Quiz Preview
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                        {quiz.name}
                    </h1>
                </div>

                {finished ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto rounded-full border-4 border-light-teal/30 bg-light-teal/10 flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold text-light-teal">
                                    {score}/{total}
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {score === total
                                    ? "Perfect score!"
                                    : score >= total / 2
                                        ? "Well done!"
                                        : "Keep practicing!"}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                You answered {score} out of {total} questions correctly.
                            </p>
                        </div>

                        <div className="space-y-3 text-left mb-8">
                            {quiz.content.map((q, i) => {
                                const chosen = answers[i];
                                const correct = q.options.find((o) => toBoolean(o.is_correct))?.option;
                                const isRight = chosen === correct;
                                return (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border ${isRight
                                            ? "border-light-teal/30 bg-light-teal/10"
                                            : "border-red-200 bg-red-50"
                                            }`}
                                    >
                                        <p className="text-xs text-gray-400 mb-1">Q{i + 1}</p>
                                        <p className="text-sm text-gray-800 font-medium mb-2">
                                            {q.question}
                                        </p>
                                        {!isRight && (
                                            <p className="text-xs text-red-500">
                                                Your answer:{" "}
                                                <span className="font-semibold">{chosen}</span>
                                            </p>
                                        )}
                                        <p className="text-xs text-light-teal">
                                            Correct: <span className="font-semibold">{correct}</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleRestart}
                            className="w-full py-3 rounded-xl bg-brand-gradient text-white text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div
                        key={currentQ}
                        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                        <div className="h-1 bg-gray-100">
                            <div
                                className="h-full bg-light-teal transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                    Question {currentQ + 1} of {total}
                                </span>
                                <div className="flex gap-1.5">
                                    {quiz.content.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i < currentQ
                                                ? "w-4 bg-light-teal"
                                                : i === currentQ
                                                    ? "w-6 bg-light-teal/60"
                                                    : "w-4 bg-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900 leading-snug mb-6">
                                {question.question}
                            </h2>

                            <div className="space-y-3 mb-8">
                                {question.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(opt)}
                                        disabled={revealed}
                                        className={optionStyle(opt)}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span
                                                className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors duration-200 ${revealed && toBoolean(opt.is_correct)
                                                    ? "border-light-teal bg-light-teal text-white"
                                                    : revealed &&
                                                        selected === opt.option &&
                                                        !toBoolean(opt.is_correct)
                                                        ? "border-red-400 bg-red-400 text-white"
                                                        : selected === opt.option
                                                            ? "border-dark-teal bg-dark-teal text-white"
                                                            : "border-gray-300 text-gray-500"
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {opt.option}
                                            {revealed && toBoolean(opt.is_correct) && (
                                                <span className="ml-auto text-light-teal text-base">
                                                    ✓
                                                </span>
                                            )}
                                            {revealed &&
                                                selected === opt.option &&
                                                !toBoolean(opt.is_correct) && (
                                                    <span className="ml-auto text-red-500 text-base">
                                                        ✗
                                                    </span>
                                                )}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {revealed && (
                                <div
                                    className={`mb-6 p-3 rounded-xl border text-sm ${toBoolean(question.options.find((o) => o.option === selected)?.is_correct)
                                        ? "border-light-teal/30 bg-light-teal/10 text-light-teal"
                                        : "border-red-200 bg-red-50 text-red-600"
                                        }`}
                                >
                                    {toBoolean(question.options.find((o) => o.option === selected)?.is_correct)
                                        ? "✓ Correct! Great job."
                                        : `✗ Not quite. The correct answer is "${question.options.find((o) => toBoolean(o.is_correct))?.option
                                        }".`}
                                </div>
                            )}

                            {!revealed ? (
                                <button
                                    onClick={handleReveal}
                                    disabled={!selected}
                                    className="w-full py-3 rounded-xl bg-brand-gradient text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="w-full py-3 rounded-xl border-2 border-dark-teal text-dark-teal text-sm font-semibold hover:bg-dark-teal hover:text-white transition-all"
                                >
                                    {currentQ + 1 >= total ? "See Results →" : "Next Question →"}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
