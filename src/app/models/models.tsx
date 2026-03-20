export interface Training {
  id: string;
  name: string;
  slug: string;
  primary_image_url: string;
  lectures: {
    lecture_id: string;
    lecture_name: string;
    video_url: string;
    video_size: number;
  }[];
  subtitle: string;
  training_url: string;
}

export interface Lecture {
  id: string;
  title?: string;
  type: "Lecture" | "Quiz";
  description?: string;
  quiz_questions?: QuizQuestion[];
  tags?: string[];
}

export interface QuizQuestion {
  question: string;
  options: { option: string; is_correct: boolean }[];
}
