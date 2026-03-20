"use client";

import { useEffect, useRef, useState } from "react";
import { MOCK_COURSES, MOCK_TRAININGS } from "../models/mocks";

export function CareerAdvice({
  user,
  skillTags,
  onClose,
}: {
  user: { name: string; role: string };
  skillTags: { tag: string; count: number }[];
  onClose: () => void;
}) {
  const [data, setData] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const IS_CHAT_ENABLED = false;

  const targetRef = useRef<HTMLDivElement>(null);

  const scrollToElement = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const defaultScoredTags = [
    { tag: "Backend", score: 5 },
    { tag: "React.JS", score: 2 },
    { tag: "Data Structures", score: 3 },
    { tag: "Rest API", score: 3 },
    { tag: "Rust Programming", score: 2 },
  ];

  const fetchCareerAdvice = async () => {
    try {
      // Fetch the streaming endpoint
      const response = await fetch(`http://localhost:8000/career-advice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: user.role,
          skillTags: skillTags || defaultScoredTags,
        }),
      });
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
      setMessages([...messages, data]);
    }
  };

  useEffect(() => {
    console.log("Data:", data, "IsLoading:", isLoading);
    if (data === "" && !isLoading) {
      setLoading(true);
      fetchCareerAdvice();
    }

    // const scrollInterval = setInterval(scrollToElement, 1000);
    // return () => clearInterval(scrollInterval);
  }, []);

  // fetchCareerAdvice();
  return (
    <div
      className="fixed inset-0 z-50 w-screen flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-scroll"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl mx-4 p-6 h-2/3 w-2/3 shadow-xl overflow-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-800">
              ✦ Career Advice
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>
        {IS_CHAT_ENABLED &&
          messages.map((message) => {
            return (
              <div className="bg-[#f8fdfc] border border-[#b2e8e4] rounded-lg p-4 mb-4">
                <p className="whitespace-pre-wrap">{message}</p>
              </div>
            );
          })}
        <div className="bg-[#f8fdfc] border border-[#b2e8e4] rounded-lg p-4 mb-4">
          <p className="whitespace-pre-wrap">{data}</p>
        </div>
        <div ref={targetRef}></div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const MOCK_USER = {
    id: "12345",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    role: "Full Stack Engineer",
    courses: MOCK_COURSES.map((c) => {
      return { id: c.id, completedLectures: [c.activities[0].id] };
    }),
  };

  function getAllTags(): { tag: string; count: number }[] {
    const tagsRated: Record<string, number> = {};
    MOCK_USER.courses.forEach(({ id: courseId, completedLectures }) => {
      const course = MOCK_COURSES.find((course) => course.id === courseId);
      const lectures =
        course?.activities.filter((a) => completedLectures.includes(a.id)) ||
        [];
      lectures.forEach((lecture) => {
        const tags = lecture.tags || [];
        tags.forEach((tag) => {
          const currentRating = tagsRated[tag] || 0;
          tagsRated[tag] = currentRating + 1;
        });
      });
    });
    const sorted = Object.entries(tagsRated).sort((a, b) => b[1] - a[1]);
    return sorted.map(([tag, count]) => ({ tag, count }));
  }

  const [allTags, setAllTags] =
    useState<{ tag: string; count: number }[]>(getAllTags());
  const [isCareerAdviceOpen, setIsCareerAdviceOpen] = useState(false);

  return (
    <div className="max-h-[85vh] w-full p-24 flex flex-col items-center justify-center bg-gray-50">
      {isCareerAdviceOpen && (
        <CareerAdvice
          user={{ name: MOCK_USER.name, role: MOCK_USER.role }}
          skillTags={allTags}
          onClose={() => setIsCareerAdviceOpen(false)}
        />
      )}
      <h1 className="w-full max-w-4xl text-2xl font-bold text-gray-800 text-left">
        Profile Page
      </h1>
      <div className="w-full max-w-4xl flex flex-col gap-6 mt-6 bg-white rounded-lg shadow-md w-full">
        <div className="flex flex-row items-end gap-4 bg-gradient-to-br from-[#1aad9e]/60 to-[#0d8f82] border border-[#b2e8e4] px-8 py-5 rounded-t-lg relative overflow-hidden before:absolute before:top-[-10px] before:left-[85%] before:content-[''] before:bg-white/[05%] before:w-64 before:h-64 before:rounded-full after:absolute after:bottom-10 after:left-[60%] after:content-[''] after:bg-white/10 after:w-24 after:h-24 after:rounded-full">
          <div className="w-14 h-14 flex items-center justify-center bg-[#1aad9e] border-2 border-white/50 text-[#ffffff] font-bold rounded-full">
            {MOCK_USER.name.charAt(0)}
          </div>
          <div>
            <p className="text-[#ffffff]/90 text-xl font-bold whitespace-nowrap">
              {MOCK_USER.name}
            </p>
            <p className="text-[#ffffff]/60 font-semibold whitespace-nowrap">
              {MOCK_USER.role}
            </p>
          </div>
        </div>
        <div className="p-6 flex flex-row justify-between gap-12">
          <div>
            <p className="text-gray-600">Name:</p>
            <p className="font-semibold whitespace-nowrap">{MOCK_USER.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-semibold whitespace-nowrap">{MOCK_USER.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone:</p>
            <p className="font-semibold whitespace-nowrap">{MOCK_USER.phone}</p>
          </div>
        </div>
        <hr className="mx-6" />
        <div className="p-6 flex flex-col">
          <span className="font-bold">Courses</span>
          <div className="flex flex-row gap-4 overflow-x-auto py-2">
            {MOCK_USER.courses.map(({ id: courseId, completedLectures }) => {
              const course = MOCK_COURSES.find((c) => c.id === courseId);
              return (
                <div
                  key={courseId}
                  className="min-w-[200px] flex-shrink-0 bg-[#f8fdfc] hover:bg-[#e0f9f8] border border-[#b2e8e4] rounded-lg p-4 cursor-pointer transition-colors duration-300 ease-in-out"
                >
                  <p className="font-semibold">{course?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {course?.activities.length === completedLectures.length
                      ? "Completed"
                      : "In Progress"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <hr className="mx-6" />
        <div className="p-6 flex flex-col gap-4">
          <span className="font-bold">Skill Tags</span>
          <div className="flex flex-row gap-2 flex-wrap">
            {allTags.map(({ tag, count }) => (
              <span
                key={tag}
                className="cursor-default inline-block bg-[#e6f7f6] hover:bg-[#0e7a70] text-[#0e7a70] hover:text-white border border-[#b2e8e4] hover:no-border hover:drop-shadow-lg items-center px-3 py-1 rounded-full text-sm transition-colors duration-300 ease-in-out"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-row justify-between cursor-default inline-block bg-[#e6f7f6] text-[#0e7a70]  border border-[#b2e8e4] px-8 py-5 rounded-lg">
            <div>
              <p className="text-sm font-bold">✦ Career Advice</p>
              <p className="text-sm">{`Get personalized career guidance based on ${MOCK_USER.name.split(" ")[0]}'s skill tags and learning history.`}</p>
            </div>
            <button
              onClick={() => setIsCareerAdviceOpen(true)}
              className="ml-6 px-4 py-2 bg-[#0e7a70] text-white rounded-lg text-sm font-semibold hover:bg-[#0b5a52] transition-colors duration-300 ease-in-out"
            >
              Get Advice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
