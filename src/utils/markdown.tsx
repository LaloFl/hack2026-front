import { Lecture, QuizQuestion } from "@/app/models/models";
import { useState } from "react";

export const TYPE_STYLES: Record<Lecture["type"], string> = {
  Lecture: "bg-light-teal/10 text-light-teal border-light-teal/30",
  Quiz: "bg-yellow/10 text-yellow border-yellow/30",
};

// --- Markdown renderer (no external lib needed) ---
export function renderMarkdown(content: string): string {
  return content
    // Code blocks first (before any inline replacements touch their contents)
    .replace(
      /```[\w]*\n([\s\S]*?)```/gm,
      '<pre class="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto my-4"><code>$1</code></pre>',
    )
    // Headings
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-sm font-semibold text-gray-800 mt-5 mb-1">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-base font-semibold text-gray-900 mt-6 mb-2">$1</h2>',
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-lg font-bold text-gray-900 mt-6 mb-2">$1</h1>',
    )
    // Inline styles
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-light-teal px-1 py-0.5 rounded text-xs font-mono">$1</code>',
    )
    // Blockquote
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-2 border-gray-200 pl-3 text-gray-400 italic my-2">$1</blockquote>',
    )
    // Wrap consecutive list items in a <ul>
    .replace(
      /((?:^- .+$\n?)+)/gm,
      (match) => {
        const items = match
          .trim()
          .split("\n")
          .map((line) =>
            `<li class="text-gray-600">${line.replace(/^- /, "")}</li>`,
          )
          .join("");
        return `<ul class="list-disc list-inside space-y-1 my-3 text-sm">${items}</ul>`;
      },
    )
    // Paragraphs — wrap plain text lines in <p>, skip already-tagged lines
    .replace(
      /^(?!<[a-z]).+$/gm,
      '<p class="text-gray-600 leading-relaxed my-2">$&</p>',
    )
    // Clean up excess blank lines between block elements
    .replace(/\n{2,}/g, "\n");
}

export function parseQuizMarkdown(markdown: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const blocks = markdown.split("?>").filter(Boolean);
  for (const block of blocks) {
    const lines = block.trim().split("\n").filter(Boolean);
    const question = lines[0].trim();
    const options = lines
      .slice(1)
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("* "))
          return { option: trimmed.slice(2), is_correct: true };
        if (trimmed.startsWith("- "))
          return { option: trimmed.slice(2), is_correct: false };
        return null;
      })
      .filter(Boolean) as { option: string; is_correct: boolean }[];
    if (question && options.length > 0) questions.push({ question, options });
  }
  return questions;
}

export function QuizCard({ question, options }: QuizQuestion) {
  const [selected, setSelected] = useState<number | null>(null);

  const getStyle = (index: number, correct: boolean) => {
    if (selected === null)
      return "border-gray-200 hover:border-dark-teal cursor-pointer";
    if (index === selected && correct)
      return "border-light-teal bg-light-teal/10 text-light-teal";
    if (index === selected && !correct)
      return "border-red-400 bg-red-50 text-red-600";
    if (correct) return "border-light-teal bg-light-teal/10 text-light-teal";
    return "border-gray-100 opacity-50";
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-white">
      <p className="text-sm font-semibold text-gray-800">{question}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            disabled={selected !== null}
            onClick={() => setSelected(i)}
            className={`text-left px-4 py-2 rounded-xl border text-sm transition-all ${getStyle(i, opt.is_correct)}`}
          >
            {opt.option}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p
          className={`text-xs font-medium ${options[selected].option ? "text-light-teal" : "text-red-500"}`}
        >
          {options[selected].is_correct
            ? "✓ Correct!"
            : `✗ Correct answer: ${options.find((o) => o.is_correct)?.option}`}
        </p>
      )}
    </div>
  );
}

// --- Markdown hint modal ---
export const MARKDOWN_HINTS = [
  { syntax: "## Heading", description: "Section heading" },
  { syntax: "### Subheading", description: "Subsection heading" },
  { syntax: "**bold**", description: "Bold text" },
  { syntax: "_italic_", description: "Italic text" },
  { syntax: "`code`", description: "Inline code" },
  { syntax: "```ts\ncode\n```", description: "Code block" },
  { syntax: "- item", description: "Bullet list item" },
  { syntax: "> note", description: "Blockquote / callout" },
  { syntax: "?> Question\n* Correct\n- Wrong", description: "Quiz question" },
];

export function MarkdownHintModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Markdown syntax guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        <div className="p-5 flex flex-col gap-2">
          {MARKDOWN_HINTS.map((hint) => (
            <div key={hint.syntax} className="flex items-start gap-3">
              <code className="text-xs bg-gray-100 text-light-teal px-2 py-1 rounded-lg font-mono whitespace-pre shrink-0">
                {hint.syntax}
              </code>
              <span className="text-xs text-gray-500 pt-1">
                {hint.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
