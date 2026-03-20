"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lecture } from "@/app/models/models";
import { MOCK_TRAININGS } from "@/app/models/mocks";
import {
  MarkdownHintModal,
  parseQuizMarkdown,
  QuizCard,
  renderMarkdown,
  TYPE_STYLES,
} from "@/utils/markdown";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// --- Preview modal ---
export function PreviewModal({
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

  const [data, setData] = useState("");
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the streaming endpoint
        const response = await fetch(
          `http://localhost:8000/generate-course-stream?transcript_name=${encodeURIComponent(slug)}.txt`,
        );
        if (!response.ok || !response.body) {
          throw new Error("Failed to fetch stream");
        }

        // Get a reader from the response body and a decoder for text
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedData = "";

        // Read the stream chunk by chunk
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          // Decode the chunk (Uint8Array) into a string
          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;
          // Update the state with the accumulated data, triggering re-renders
          setData(accumulatedData);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        const response = await fetch(`http://localhost:8000/courses/${slug}`);
        const data: { lectures: Lecture[] } = await response.json();
        data.lectures.forEach((lecture: any) => {
          lecture.id = crypto.randomUUID();
          lecture.type = "Lecture";
        });
        setLectures(data.lectures);
        setEdits(
          Object.fromEntries(
            data.lectures.map((l) => [l.id, l.description || ""]),
          ),
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const trainingName =
    MOCK_TRAININGS.find((t) => t.lectures[0]?.lecture_id === slug)?.name ??
    "Unknown Training";

  const [edits, setEdits] = useState<Record<string, string>>(
    Object.fromEntries(lectures.map((l) => [l.id, l.description || ""])),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  function handleSelectLecture(id: string) {
    setSelectedId(id);
    setSelectedLecture(lectures.find((l) => l.id === id) ?? null);
  }

  function handleContentChange(value: string) {
    if (!selectedId) return;
    setEdits((prev) => ({ ...prev, [selectedId]: value }));
  }

  async function handleEnhance() {
    if (!selectedId) return;
    setIsEnhancing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setEdits((prev) => ({
      ...prev,
      [selectedId]:
        prev[selectedId] + "\n\n> ✨ Enhanced content will be appended here.",
    }));
    setIsEnhancing(false);
  }

  async function handleGenerateQuiz() {
    if (!selectedId) return;
    setIsEnhancing(true);
    const quizId = crypto.randomUUID();
    const quizJson: Lecture = {
      id: quizId,
      type: "Quiz",
      quiz_questions: [
        {
          question: "What is the capital of France?",
          options: [
            { option: "Paris", is_correct: true },
            { option: "London", is_correct: false },
            { option: "Berlin", is_correct: false },
            { option: "Madrid", is_correct: false },
          ],
        },
      ],
      tags: selectedLecture?.tags,
    };
    quizJson.title = `Quiz for: ${selectedLecture?.title}`;
    setLectures([...lectures, quizJson as Lecture]);
    const quizContent =
      quizJson?.quiz_questions
        ?.map(
          (q) =>
            `?> ${q.question}\n` +
            q.options
              .map((o) => `${o.is_correct ? "* " : "- "}${o.option}`)
              .join("\n"),
        )
        .join("\n\n") + "\n\n";
    setEdits((prev) => ({
      ...prev,
      [quizId]: quizContent,
    }));
    setIsEnhancing(false);
  }

  function handleSubmit() {
    sessionStorage.setItem("lectureEdits", JSON.stringify(edits));
    router.push(`/admin/create/${slug}/preview`);
  }

  return (
    <>
      {/* Modals */}
      {showHints && <MarkdownHintModal onClose={() => setShowHints(false)} />}
      {showPreview && selectedLecture && (
        <PreviewModal
          lecture={selectedLecture}
          content={edits[selectedId || ""] || ""}
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
              {lectures ? lectures.length : "No "} lectures
            </span>
          </div>

          <div className="flex gap-0 divide-x divide-gray-100">
            {/* LEFT */}
            <div className="w-1/2 flex flex-col p-5 gap-4">
              {/* Thumbnail */}
              <div className="rounded-xl overflow-hidden border border-gray-200 h-[180px] bg-gray-100 flex items-center justify-center">
                <img
                  src={
                    MOCK_TRAININGS.find(
                      (t) => t.lectures[0]?.lecture_id === slug,
                    )?.primary_image_url
                  }
                  alt="Training thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Editor */}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
                  <p>Loading lectures...</p>
                </div>
              ) : (
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
                    className="w-full flex-1 min-h-[220px] resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-light-teal/40 focus:border-light-teal transition-all placeholder:text-gray-300"
                    placeholder={
                      selectedLecture
                        ? "Edit lecture markdown here..."
                        : "← Select a lecture to start editing"
                    }
                    value={edits[selectedId || ""] || ""}
                    onChange={(e) => handleContentChange(e.target.value)}
                    disabled={!selectedId}
                  />

                  <div>
                    {!!selectedLecture &&
                      selectedLecture?.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <button
                    onClick={handleEnhance}
                    disabled={!selectedId || isEnhancing}
                    className="w-full py-2 rounded-xl bg-brand-gradient text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isEnhancing ? "Enhancing..." : "✦ Enhance with AI"}
                  </button>

                  <button
                    onClick={handleGenerateQuiz}
                    disabled={!selectedId || isEnhancing}
                    className="w-full py-2 rounded-xl border-2 border-[--secondary-2] text-[--secondary-2] text-sm font-medium hover:bg-[--secondary-2] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isEnhancing ? "Enhancing..." : "✦ Generate Quiz"}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="w-1/2 flex flex-col p-5 gap-3">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
                  {/* <div
                    style={{
                      whiteSpace: "pre-wrap",
                      padding: "10px",
                    }}
                  >
                    {data}
                  </div> */}
                  <span className="whitespace-pre-line p-5 max-h-[520px] overflow-y-auto text-xs text-gray-500">
                    {data}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated lectures
                    </label>

                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[520px] pr-1">
                      {lectures.map((lecture, i) => {
                        const isSelected = selectedId === lecture.id;
                        const isDirty =
                          edits[lecture.id] !== lecture.description;

                        return (
                          <button
                            key={lecture.id}
                            onClick={() => handleSelectLecture(lecture.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl border transition-all
                                                ${
                                                  isSelected
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
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="mt-2 w-full py-2.5 rounded-xl border-2 border-dark-teal text-dark-teal text-sm font-semibold hover:bg-dark-teal hover:text-white transition-all"
                  >
                    Review & Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
