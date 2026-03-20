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

        const options = lines.slice(1).map((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("* ")) {
                return { text: trimmed.slice(2), correct: true };
            }
            if (trimmed.startsWith("- ")) {
                return { text: trimmed.slice(2), correct: false };
            }
            return null;
        }).filter(Boolean) as { text: string; correct: boolean }[];

        if (question && options.length > 0) {
            questions.push({ question, options });
        }
    }

    return questions;
}