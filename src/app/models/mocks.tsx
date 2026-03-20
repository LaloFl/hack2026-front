import { Lecture, Training } from "./models";

export const MOCK_TRAININGS: Training[] = [
  {
    id: "6266df0975cbf00b1069bd6a",
    name: "Test Automation with Python",
    slug: "test-automation-with-python-tech-tech-talk-f6f7d",
    primary_image_url:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/test-automation-with-python-tech-tech-talk-f6f7d-primary",
    lectures: [
      {
        lecture_id: "628e948e55b2180a6ae6e2d9",
        lecture_name: "Test Automation with Python",
        video_url:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/96ad3435-2926-4d4e-95a4-e5ea393cf1b4",
        video_size: 49749736,
      },
    ],
    subtitle: "No subtitle",
    training_url:
      "https://micoach.itj.com/trainings/test-automation-with-python-tech-tech-talk-f6f7d/lectures/628e948e55b2180a6ae6e2d9",
  },
  {
    id: "621efe0edc2ba109a3da2ba2",
    name: "Technical Writing in the Software Industry",
    slug: "technical-writing-in-the-software-industry-tech-tech-talk-fbe99",
    primary_image_url:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/technical-writing-in-the-software-industry-tech-tech-talk-fbe99-primary",
    lectures: [
      {
        lecture_id: "626b07c7180f531434467506",
        lecture_name: "Technical Writing in the Software Industry",
        video_url:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/0878e71d-c230-4391-9285-2588459c443f",
        video_size: 68356770,
      },
    ],
    subtitle: "No subtitle",
    training_url:
      "https://micoach.itj.com/trainings/technical-writing-in-the-software-industry-tech-tech-talk-fbe99/lectures/626b07c7180f531434467506",
  },
  {
    id: "61651d821771026320ae2566",
    name: "Physics: Dark Matter and Dark Energy",
    slug: "physics-dark-matter-and-dark-energy-tech-tech-talk-f2a57",
    primary_image_url:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/physics-dark-matter-and-dark-energy-tech-tech-talk-f2a57-primary",
    lectures: [
      {
        lecture_id: "621eff3c2043110a003aa9ca",
        lecture_name: "Physics: Dark Matter and Dark Energy",
        video_url:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/59f15a66-6aef-495b-9734-c5b3ff09f0e4",
        video_size: 74235057,
      },
    ],
    subtitle: "No subtitle",
    training_url:
      "https://micoach.itj.com/trainings/physics-dark-matter-and-dark-energy-tech-tech-talk-f2a57/lectures/621eff3c2043110a003aa9ca",
  },
  {
    id: "621efe0cdc2ba109a3da2b87",
    name: "Quantum Computing",
    slug: "quantum-computing-tech-tech-talk-a6258",
    primary_image_url:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/quantum-computing-tech-tech-talk-a6258-primary",
    lectures: [
      {
        lecture_id: "621efe0cdc2ba109a3da2b88",
        lecture_name: "Quantum Computing",
        video_url:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/05b77d81-2157-462d-bae3-c38cbbeef670",
        video_size: 74859820,
      },
    ],
    subtitle: "No subtitle",
    training_url:
      "https://micoach.itj.com/trainings/quantum-computing-tech-tech-talk-a6258/lectures/621efe0cdc2ba109a3da2b88",
  },
  {
    id: "67d496b7beff0cf8ce7b661d",
    name: "Mastering Innovation Management",
    slug: "mastering-innovation-management-tech-talk",
    primary_image_url:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/mastering-innovation-management-tech-talk-primary.png",
    lectures: [
      {
        lecture_id: "67e5d77a360e42a2f2c76312",
        lecture_name: "Mastering Innovation Management",
        video_url:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/mastering-innovation-management-tech-talk.mp4",
        video_size: 77290953,
      },
    ],
    subtitle: "Transform Buzzwords into Actionable Tech Strategies",
    training_url:
      "https://micoach.itj.com/trainings/mastering-innovation-management-tech-talk/lectures/67e5d77a360e42a2f2c76312",
  },
  {
    id: "6568dd98a6e59f6774affbca",
    name: "Six Sigma: DMAIC Method for Effective Improvements",
    slug: "six-sigma-dmaic-method-for-effective-improvements-tech-talk",
    primary_image_url:
      "https://micoach-prod-bucket.s3.amazonaws.com/events/six-sigma-dmaic-method-for-effective-improvements-tech-talk-primary",
    lectures: [
      {
        lecture_id: "657ca50a76635dbbe6e672e6",
        lecture_name: "Six Sigma: DMAIC Method for Effective Improvements",
        video_url:
          "https://micoach-prod-bucket.s3.amazonaws.com/events/854924f6-9b71-11ee-8c90-0242ac120002.mp4",
        video_size: 80876978,
      },
    ],
    subtitle: "No subtitle",
    training_url:
      "https://micoach.itj.com/trainings/six-sigma-dmaic-method-for-effective-improvements-tech-talk/lectures/657ca50a76635dbbe6e672e6",
  },
];

export const MOCK_LECTURES: Lecture[] = [
  {
    id: "1",
    title: "Introduction to TypeScript",
    type: "Lecture",
    content: `## Introduction to TypeScript

TypeScript is a **typed superset of JavaScript** that compiles to plain JavaScript.

### Why TypeScript?
- Catches errors at _compile time_ rather than runtime
- Provides better IDE support with autocompletion
- Makes large codebases easier to maintain

### Basic Types
You can annotate variables with types like \`string\`, \`number\`, \`boolean\`, and more.

\`\`\`ts
const name: string = "Alice";
const age: number = 30;
const active: boolean = true;
\`\`\``,
    enhancedContent: "",
  },
  {
    id: "2",
    title: "Interfaces and Type Aliases",
    type: "Lecture",
    content: `## Interfaces and Type Aliases

Both **interfaces** and **type aliases** allow you to define the shape of an object.

### Interface
\`\`\`ts
interface User {
  id: string;
  name: string;
  age?: number;
}
\`\`\`

### Type Alias
\`\`\`ts
type Status = "active" | "inactive" | "pending";
\`\`\`

### Key difference
Use \`interface\` when defining object shapes — it supports _declaration merging_.
Use \`type\` for unions, primitives, and more complex compositions.`,
    enhancedContent: "",
  },
  {
    id: "3",
    title: "TypeScript Basics Quiz",
    type: "Quiz",
    content: `## Quiz: TypeScript Basics

?> What is TypeScript?
- A JavaScript runtime environment
- A CSS preprocessor
* A typed superset of JavaScript
- A backend framework

?> Which of the following is a valid TypeScript type annotation?
- const name = string "Alice"
* const name: string = "Alice"
- const name :: string = "Alice"
- const string name = "Alice"`,
  },
  {
    id: "4",
    title: "Interfaces and Types Quiz",
    type: "Quiz",
    content: `## Quiz: Interfaces and Types

?> What keyword is used to define an interface in TypeScript?
- type
- class
* interface
- struct

?> Which syntax correctly defines a union type?
* type Status = "active" | "inactive"
- interface Status = "active" | "inactive"
- type Status = "active" & "inactive"
- const Status: union = ["active", "inactive"]`,
    enhancedContent: "",
  },
];
