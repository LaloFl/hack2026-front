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
            "relative w-full text-left px-5 py-4 rounded-2xl border-2 font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer focus:outline-none";
        if (!revealed) {
            return selected === opt.option
                ? `${base} border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]`
                : `${base} border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/60`;
        }
        if (toBoolean(opt.is_correct))
            return `${base} border-emerald-400 bg-emerald-500/15 text-emerald-200`;
        if (selected === opt.option && !toBoolean(opt.is_correct))
            return `${base} border-rose-400 bg-rose-500/15 text-rose-200`;
        return `${base} border-slate-700/50 bg-slate-900/30 text-slate-500`;
    };

    return (
        <div
            className="flex items-center justify-center p-4 rounded-lg"
            style={{
                background:
                    "radial-gradient(ellipse at 15% 45%, #0f172a 0%, #020617 62%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .option-btn { transition: border-color 0.15s, background 0.15s, transform 0.1s; }
        .option-btn:active:not(:disabled) { transform: scale(0.98); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        @keyframes pop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        .pop { animation: pop 0.3s ease; }
      `}</style>

            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="mb-8 fade-up">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">
                        Quiz Preview
                    </p>
                    <h1 className="syne text-3xl font-800 text-white leading-tight">
                        {quiz.name}
                    </h1>
                </div>

                {finished ? (
                    /* Results Card */
                    <div className="fade-up rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur p-8 text-center shadow-2xl">
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full border-4 border-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(34,211,238,0.22)]">
                                <span className="syne text-3xl font-bold text-cyan-300">
                                    {score}/{total}
                                </span>
                            </div>
                            <h2 className="syne text-2xl font-bold text-white mb-2">
                                {score === total
                                    ? "Perfect score! 🎉"
                                    : score >= total / 2
                                        ? "Well done!"
                                        : "Keep practicing!"}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                You answered {score} out of {total} questions correctly.
                            </p>
                        </div>

                        {/* Answer Review */}
                        <div className="space-y-3 text-left mb-8">
                            {quiz.content.map((q, i) => {
                                const chosen = answers[i];
                                const correct = q.options.find((o) => toBoolean(o.is_correct))?.option;
                                const isRight = chosen === correct;
                                return (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border ${isRight
                                            ? "border-emerald-700 bg-emerald-900/20"
                                            : "border-rose-700 bg-rose-900/20"
                                            }`}
                                    >
                                        <p className="text-xs text-slate-400 mb-1">Q{i + 1}</p>
                                        <p className="text-sm text-slate-200 font-medium mb-2">
                                            {q.question}
                                        </p>
                                        {!isRight && (
                                            <p className="text-xs text-rose-300">
                                                Your answer:{" "}
                                                <span className="font-semibold">{chosen}</span>
                                            </p>
                                        )}
                                        <p className="text-xs text-emerald-300">
                                            Correct: <span className="font-semibold">{correct}</span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleRestart}
                            className="w-full py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 syne font-bold text-sm tracking-wide transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    /* Question Card */
                    <div
                        key={currentQ}
                        className="fade-up rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-2xl overflow-hidden"
                    >
                        {/* Progress bar */}
                        <div className="h-1 bg-slate-800">
                            <div
                                className="h-full bg-cyan-400 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="p-8">
                            {/* Question counter */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                    Question {currentQ + 1} of {total}
                                </span>
                                <div className="flex gap-1.5">
                                    {quiz.content.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i < currentQ
                                                ? "w-4 bg-cyan-400"
                                                : i === currentQ
                                                    ? "w-6 bg-cyan-400/60"
                                                    : "w-4 bg-slate-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Question */}
                            <h2 className="syne text-xl font-bold text-white leading-snug mb-8">
                                {question.question}
                            </h2>

                            {/* Options */}
                            <div className="space-y-3 mb-8">
                                {question.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(opt)}
                                        disabled={revealed}
                                        className={`option-btn ${optionStyle(opt)} w-full`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span
                                                className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors duration-200 ${revealed && toBoolean(opt.is_correct)
                                                    ? "border-emerald-400 bg-emerald-400 text-slate-900"
                                                    : revealed &&
                                                        selected === opt.option &&
                                                        !toBoolean(opt.is_correct)
                                                        ? "border-rose-400 bg-rose-400 text-slate-900"
                                                        : selected === opt.option
                                                            ? "border-cyan-400 bg-cyan-400 text-slate-900"
                                                            : "border-current opacity-50"
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            {opt.option}
                                            {revealed && toBoolean(opt.is_correct) && (
                                                <span className="ml-auto text-emerald-300 text-base">
                                                    ✓
                                                </span>
                                            )}
                                            {revealed &&
                                                selected === opt.option &&
                                                !toBoolean(opt.is_correct) && (
                                                    <span className="ml-auto text-rose-300 text-base">
                                                        ✗
                                                    </span>
                                                )}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Feedback */}
                            {revealed && (
                                <div
                                    className={`fade-up mb-6 p-4 rounded-xl border text-sm ${toBoolean(question.options.find((o) => o.option === selected)?.is_correct)
                                        ? "border-emerald-700 bg-emerald-900/30 text-emerald-200"
                                        : "border-rose-700 bg-rose-900/30 text-rose-200"
                                        }`}
                                >
                                    {toBoolean(question.options.find((o) => o.option === selected)?.is_correct)
                                        ? "✓ Correct! Great job."
                                        : `✗ Not quite. The correct answer is "${question.options.find((o) => toBoolean(o.is_correct))?.option
                                        }".`}
                                </div>
                            )}

                            {/* Action Button */}
                            {!revealed ? (
                                <button
                                    onClick={handleReveal}
                                    disabled={!selected}
                                    className="w-full py-4 rounded-2xl syne font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-cyan-400 hover:bg-cyan-300 text-slate-950"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="pop w-full py-4 rounded-2xl syne font-bold text-sm tracking-wide bg-slate-100 hover:bg-white text-slate-900 transition-colors duration-200"
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
