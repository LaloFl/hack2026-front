import { MOCK_TRAININGS } from "@/app/models/mocks";
import { Training } from "@/app/models/models";
import CoursesClient from "./CoursesClient";

interface CourseListItem {
    id: string;
    slug: string;
}

async function getPublishedCourses(): Promise<Training[]> {
    try {
        const res = await fetch("http://localhost:8000/courses", {
            cache: "no-store",
        });
        if (!res.ok) return [];

        const data: CourseListItem[] = await res.json();

        return data
            .map((course) => {
                const match = MOCK_TRAININGS.find(
                    (t) => t.lectures[0]?.lecture_id === course.id || t.slug === course.slug
                );
                return match ?? null;
            })
            .filter((t): t is Training => t !== null);
    } catch {
        return [];
    }
}

export default async function CoursesPage() {
    // const courses = await getPublishedCourses();
    const data = await fetch('http://localhost:8000/courses')
    const courses = (await data.json()).map((course: any) => { return { ...course, primary_image_url: MOCK_TRAININGS.find((c) => c.lectures[0].lecture_id === course.id)?.primary_image_url } })
    // .filter((t: any): t is Training => t !== null);
    console.log(data)
    console.log(courses)

    return <CoursesClient courses={courses} />;
}