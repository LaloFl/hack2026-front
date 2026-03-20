"use client";

import Dropdown from "../../../../components/Dropdown";
import Image from "next/image";

interface PreviewProps {
  lectures: { title: string; description: string; minutes?: number }[];
}

export default function Preview({ lectures }: PreviewProps) {
  const course = {
    _id: "698ba8091af618cc5a7246cf",
    name: "Agile That Adapts",
    subtitle: "Designing Work Around Teams",
    type: "Tech & !Tech Talk",
    slug: "agile-that-adapts-tech-talk",
    startDate: "2026-02-27T00:00:00.000Z",
    endDate: "2026-02-27T01:00:00.000Z",
    coverImageUrl:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/agile-that-adapts-tech-talk-cover.png",
    featuredImageUrl:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/agile-that-adapts-tech-talk-featured.png",
    primaryImageUrl:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/agile-that-adapts-tech-talk-primary.png",
    thumbnailImageUrl:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/agile-that-adapts-tech-talk-thumbnail.png",
    speakers: [
      {
        name: "Guillermo Ramirez",
        imageUrl:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/speakers/guillermo-ramirez.jpg",
        role: "Senior Technical Project Manager",
        bio: "Guillermo leads cross-continent teams across the U.S., Germany, and India. He's an Agile practitioner focused on SAFe delivery and team autonomy, he believes transparency and people-centered collaboration are key to driving meaningful, lasting change.",
      },
    ],
    lectures: [{ _id: "69a8bb8fe25f1a9d2e383f2f" }],
    tags: ["Agile", "Project Management"],
  };

  const defaultLectures = [
    {
      title: "Lecture 1: Introduction to AI",
      type: "Tech & !Tech Talk",
      description:
        "An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications. An overview of artificial intelligence and its applications.",
    },
    {
      title: "Lecture 2: Machine Learning Basics",
      description:
        "Understanding the fundamentals of machine learning algorithms.",
    },
    {
      title: "Lecture 3: Deep Learning",
      description: "Exploring deep learning techniques and neural networks.",
    },
  ];

  if (!lectures || lectures.length === 0) {
    lectures = defaultLectures;
  }

  lectures.forEach((lecture) => {
    const words = lecture.description.trim().split(/\s+/).length;
    const wpm = 100;
    const minutes = Math.ceil(words / wpm);
    lecture.minutes = minutes;
  });

  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <main className="w-full min-h-screen bg-gray-100 flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="bg-gradient-to-r from-[#2f5074] to-[#44646c] w-full flex flex-col gap-4 text-background px-12 py-8 items-center sm:items-start">
        <div className="flex flex-row gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-light-teal/40 text-light-teal font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl font-medium">{course.name}</h1>
        <p className="text-md text-center sm:text-left">
          {course.subtitle} - {course.type}
        </p>
        <div className="w-full flex flex-row justify-between">
          <div>
            <p className="text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              {course.speakers.map((speaker) => speaker.name).join(", ")}
            </p>
            <p className="text-sm text-center text-[--text-gray] sm:text-left font-[family-name:var(--font-geist-mono)]">
              Date Created:{" "}
              {new Date(course.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-col gap-1 items-center">
              <p className="text-[--secondary-2] text-lg font-bold">
                {lectures.length}
              </p>
              <p className="uppercase text-sm text-[--text-gray]">lectures</p>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <p className="text-[--secondary-2] text-lg font-bold">
                {lectures.reduce(
                  (total, lecture) => total + (lecture.minutes || 0),
                  0,
                )}
              </p>
              <p className="uppercase text-sm text-[--text-gray]">minutes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 px-12 py-8">
        {lectures.map((lecture, index) => (
          <Dropdown
            key={index}
            title={lecture.title}
            body={lecture.description}
            minutes={lecture.minutes}
          />
        ))}
      </div>
      <button className="fixed bottom-5 right-5 ml-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[--primary-2] text-background gap-2 hover:bg-[--primary-2-hover] hover:-translate-y-3 transform transition text-sm sm:text-base h-12 px-12">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 2L3 8l4 2 2 4 4-12z" fill="white" />
        </svg>
        Publish
      </button>
    </main>
    // </div>
  );
}
