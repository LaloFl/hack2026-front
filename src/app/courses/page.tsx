import { MOCK_TRAININGS } from "@/app/models/mocks";
import { Training } from "@/app/models/models";
import CoursesClient from "./CoursesClient";

interface ResolvedCourse {
    training: Training;
}

async function getPublishedCourses(): Promise<ResolvedCourse[]> {
    const results = await Promise.allSettled(
        MOCK_TRAININGS.map(async (training) => {
            const res = await fetch(
                `http://localhost:8000/courses/${training.lectures[0]?.lecture_id}`,
                { cache: "no-store" }
            );
            if (!res.ok) return null;
            const data = await res.json();
            if (!data || (!data.lectures?.length && !data.quizes?.length)) return null;
            return { training };
        })
    );

    return results
        .filter(
            (r): r is PromiseFulfilledResult<ResolvedCourse> =>
                r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);
}

export default async function CoursesPage() {
    const courses = await getPublishedCourses();

    return <CoursesClient courses={courses.map((c) => c.training)} />;
}