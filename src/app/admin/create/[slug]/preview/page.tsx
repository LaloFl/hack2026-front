import { MOCK_TRAININGS } from "@/app/models/mocks";
import { Lecture, Quiz } from "@/app/models/models";
import PreviewClient from "./PreviewClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CourseResponse {
  lectures: Lecture[];
  quizes: Quiz[];
}

async function getCourse(slug: string): Promise<CourseResponse | null> {
  try {
    const res = await fetch(`http://localhost:8000/courses/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;

  const data = await getCourse(slug);
  const training = MOCK_TRAININGS.find((t) => t.lectures[0]?.lecture_id === slug);

  if (!data || !training) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center flex flex-col gap-2">
          <p className="text-gray-400 text-sm">Course not found</p>
          <p className="text-gray-300 text-xs">{slug}</p>
        </div>
      </div>
    );
  }

  return (
    <PreviewClient
      training={training}
      lectures={data.lectures ?? []}
      quizes={data.quizes ?? []}
    />
  );
}