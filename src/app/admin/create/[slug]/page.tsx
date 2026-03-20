"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Lecture } from "@/app/models/models";
import { MOCK_LECTURES, MOCK_TRAININGS } from "@/app/models/mocks";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const TYPE_STYLES: Record<Lecture["type"], string> = {
  Lecture: "bg-light-teal/10 text-light-teal border-light-teal/30",
  Quiz: "bg-yellow/10 text-yellow border-yellow/30",
};

// --- Markdown renderer (no external lib needed) ---
function renderMarkdown(content: string): string {
  return content
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-base font-semibold text-gray-800 mt-4 mb-1">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-lg font-semibold text-gray-900 mt-5 mb-2">$1</h2>',
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 class="text-xl font-bold text-gray-900 mt-6 mb-2">$1</h1>',
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-light-teal px-1 py-0.5 rounded text-xs font-mono">$1</code>',
    )
    .replace(
      /```[\w]*\n([\s\S]*?)```/g,
      '<pre class="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto my-3"><code>$1</code></pre>',
    )
    .replace(
      /^- (.+)$/gm,
      '<li class="ml-4 list-disc text-gray-700 text-sm">$1</li>',
    )
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-light-teal pl-3 text-gray-500 italic text-sm my-2">$1</blockquote>',
    )
    .replace(/\n{2,}/g, '<br class="my-2" />');
}

// --- Quiz parser + renderer ---
interface QuizQuestion {
  question: string;
  options: { text: string; correct: boolean }[];
}

function parseQuizMarkdown(markdown: string): QuizQuestion[] {
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
          return { text: trimmed.slice(2), correct: true };
        if (trimmed.startsWith("- "))
          return { text: trimmed.slice(2), correct: false };
        return null;
      })
      .filter(Boolean) as { text: string; correct: boolean }[];
    if (question && options.length > 0) questions.push({ question, options });
  }
  return questions;
}

function QuizCard({ question, options }: QuizQuestion) {
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
            className={`text-left px-4 py-2 rounded-xl border text-sm transition-all ${getStyle(i, opt.correct)}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p
          className={`text-xs font-medium ${options[selected].correct ? "text-light-teal" : "text-red-500"}`}
        >
          {options[selected].correct
            ? "✓ Correct!"
            : `✗ Correct answer: ${options.find((o) => o.correct)?.text}`}
        </p>
      )}
    </div>
  );
}

// --- Markdown hint modal ---
const MARKDOWN_HINTS = [
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

function MarkdownHintModal({ onClose }: { onClose: () => void }) {
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

// --- Preview modal ---
function PreviewModal({
  lecture,
  content,
  onClose,
}: {
  lecture: Lecture;
  content: string;
  onClose: () => void;
}) {
  const isQuiz = lecture.type === "Quiz";
  const quizQuestions = isQuiz ? parseQuizMarkdown(content) : [];

  // Strip the quiz syntax lines for the top prose part
  const proseContent = isQuiz ? content.split("?>")[0].trim() : content;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-800">
              {lecture.title}
            </h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_STYLES[lecture.type]}`}
            >
              {lecture.type}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {/* Prose section */}
          {proseContent && (
            <div
              className="text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(proseContent) }}
            />
          )}

          {/* Quiz section */}
          {isQuiz && quizQuestions.length > 0 && (
            <div className="flex flex-col gap-3 mt-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Questions
              </p>
              {quizQuestions.map((q, i) => (
                <QuizCard key={i} {...q} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main page ---
export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);

  const trainingName =
    MOCK_TRAININGS.find((t) => t.lectures[0]?.lecture_id === slug)?.name ??
    "Unknown Training";

  // const [edits, setEdits] = useState<Record<string, string>>(
  //   Object.fromEntries(MOCK_LECTURES.map((l) => [l.id, l.content])),
  // );
  const [lectures, setLectures] = useState<Lecture[]>(MOCK_LECTURES);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  function handleSelectLecture(id: string) {
    const lecture = lectures.find((l) => l.id === id);
    setSelectedLecture(lecture || null);
    setShowPreview(false);
  }

  function handleContentChange(value: string) {
    if (!selectedLecture) return;
    setSelectedLecture({ ...selectedLecture, content: value });
    setLectures((prev) =>
      prev.map((lec) =>
        lec.id === selectedLecture.id ? { ...lec, content: value } : lec,
      ),
    );
  }

  async function handleEnhance() {
    if (!selectedLecture) return;
    setIsEnhancing(true);

    try {
      const response = await fetch("http://localhost:8000/enhance-lesson-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson_id: selectedLecture.id,
          lesson_name: selectedLecture.title,
          lesson_content: selectedLecture.content,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";
      // Clean the existing content before streaming new enhancement
      setSelectedLecture({ ...selectedLecture, content: "" });

      // Read the stream and update content in real-time
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        // Update the textarea with the streamed content
        setSelectedLecture((prev) =>
          prev ? { ...prev, content: streamedContent } : prev,
        );

        // Scroll to bottom to show new content
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.scrollTop = textarea.scrollHeight;
        }
      }

      // Update the list of lectures with the enhanced content
      setLectures((prev) =>
        prev.map((lec) =>
          lec.id === selectedLecture.id ? { ...lec, content: streamedContent } : lec,
        ),
      );
    } catch (error) {
      console.error("Enhancement failed:", error);
    } finally {
      setIsEnhancing(false);
    }
  }

  function handleSubmit() {
    router.push(`/admin/create/${slug}/preview`);
  }

  return (
    <>
      {/* Modals */}
      {showHints && <MarkdownHintModal onClose={() => setShowHints(false)} />}
      {showPreview && selectedLecture && (
        <PreviewModal
          lecture={selectedLecture}
          content={selectedLecture.content}
          onClose={() => setShowPreview(false)}
        />
      )}

      <div className="flex justify-center items-start p-6 w-full min-h-screen bg-gray-50">
        <div className="max-w-[960px] min-w-[350px] w-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Top bar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                Training
              </p>
              <h1 className="text-base font-semibold text-gray-800 capitalize">
                {trainingName}
              </h1>
            </div>
            <span className="text-xs bg-light-teal/10 text-light-teal border border-light-teal/20 rounded-full px-3 py-1">
              {MOCK_LECTURES.length} lectures
            </span>
          </div>

          <div className="flex gap-0 divide-x divide-gray-100">
            {/* LEFT */}
            <div className="w-1/2 flex flex-col p-5 gap-4">
              {/* Thumbnail */}
              <div className="rounded-xl overflow-hidden border border-gray-200 h-[180px] bg-gray-100 flex items-center justify-center">
                <img
                  src="/placeholder-training.jpg"
                  alt="Training thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-gray-400 text-sm absolute">
                  No preview available
                </span>
              </div>

              {/* Editor */}
              <div className="flex flex-col gap-2 flex-1">
                {/* Toolbar row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lecture content
                    </label>
                    <button
                      onClick={() => setShowHints(true)}
                      className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 hover:border-light-teal hover:text-light-teal transition-all text-xs font-semibold flex items-center justify-center"
                      title="Markdown syntax guide"
                    >
                      ?
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedLecture && (
                      <>
                        <button
                          onClick={() => setShowPreview(true)}
                          className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:border-light-teal hover:text-light-teal transition-all"
                          disabled={!selectedLecture.content || isEnhancing}
                        >
                          Preview
                        </button>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_STYLES[selectedLecture.type]}`}
                        >
                          {selectedLecture.type}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <textarea
                  className="w-full flex-1 min-h-[220px] resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-[10px] text-gray-700 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-light-teal/40 focus:border-light-teal transition-all placeholder:text-gray-300"
                  placeholder={
                    selectedLecture
                      ? "Edit lecture markdown here..."
                      : "← Select a lecture to start editing"
                  }
                  value={selectedLecture ? selectedLecture.content : ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  disabled={!selectedLecture || isEnhancing}
                />

                <button
                  onClick={handleEnhance}
                  disabled={!selectedLecture || isEnhancing}
                  className="w-full py-2 rounded-xl bg-brand-gradient text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isEnhancing ? "Enhancing..." : "✦ Enhance with AI"}
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex flex-col p-5 gap-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generated lectures
              </label>

              <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[520px] pr-1">
                {lectures.map((lecture, i) => {
                  const isSelected = selectedLecture?.id === lecture.id;
                  const isDirty = false; // Since we're not tracking edits anymore

                  return (
                    <button
                      key={lecture.id}
                      onClick={() => handleSelectLecture(lecture.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all
                                                ${isSelected
                          ? "border-light-teal bg-light-teal/5 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-gray-400 shrink-0">
                            #{i + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {lecture.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isDirty && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-yellow"
                              title="Unsaved changes"
                            />
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_STYLES[lecture.type]}`}
                          >
                            {lecture.type}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmit}
                className="mt-2 w-full py-2.5 rounded-xl border-2 border-dark-teal text-dark-teal text-sm font-semibold hover:bg-dark-teal hover:text-white transition-all"
              >
                Review & Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
