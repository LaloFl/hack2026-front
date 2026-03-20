import { Course, Lecture, Training } from "./models";

export const MOCK_COURSES: Course[] = [
  {
    id: "6266df0975cbf00b1069bd6a",
    name: "Test Automation with Python",
    activities: [
      {
        id: "1",
        index: 0,
        type: "Lecture",
        title: "Automating Testing in Python: Best Practices and Tools",
        description:
          "In this lecture, we will delve into the importance of testing within software development with a focus on automation strategies using Python as our primary language. We'll explore various tools available for writing tests that save time and resources while ensuring code reliability before deployment to production environments. The discussion includes practical examples such as utilizing 'pi_test.sh', understanding the significance of naming test scripts with 'test_', leveraging fixtures, and using assertions in Python testing.",
        tags: ["Python", "Testing", "Automation"],
      },
      {
        id: "2",
        index: 1,
        type: "Lecture",
        title: "Advanced Testing Techniques with Fixtures in Python",
        description:
          "In today's lecture, we will delve into the sophisticated world of testing fixtries and their role in enhancing test coverage and code reuse. We will explore how to create reusable setup functions using decorators like '@pi_test', which can be customized for different content or usage scenarios within Python scripts. Our focus will also extend towards parameterizing tests with arguments, allowing us to handle multiple edge cases efficiently.",
        tags: ["Python", "Testing", "Fixtures"],
      },
      {
        id: "3",
        index: 2,
        type: "Lecture",
        title:
          "Effective Testing Strategies: Mocking Techniques and Continuous Integration",
        description:
          "In this lecture, we delve into advanced testing strategies that enhance code robustness and maintainability in software development. We explore the use of mock objects not just for unit tests but also as a means to simulate specific outputs from functions within our models. By integrating test code with main production stages seamlessly through continuous integration services like Jenkins, we ensure efficient testing workflows without extra space on containers or additional services. The discussion extends into Python's unique challenges in unit testing and the use of tools such as PyTest to measure coverage effectively.",
        tags: [
          "Frontend",
          "Backend",
          "Full Stack",
          "DevOps",
          "Code Review",
          "Git and GitHub",
        ],
      },
    ],
  },
  {
    id: "621efe0edc2ba109a3da2ba2",
    name: "Technical Writing in the Software Industry",
    activities: [
      {
        id: "4",
        index: 0,
        type: "Lecture",
        title: "Quantum Computing: The Future Frontier",
      },
    ],
  },
  {
    id: "621eff3c2043110a003aa9ca",
    name: "Physics: Dark Matter and Dark Energy",
    activities: [
      {
        id: "4",
        index: 0,
        type: "Lecture",
        title: "Quantum Computing: The Future Frontier",
        description:
          "In today's lecture, we will delve into the fascinating world of quantum computing and its potential to revolutionize various fields by leveraging principles of quantum mechanics. We will explore how these advanced machines operate on qubits that can represent zero or one but also hold multiple states simultaneously through superposition due to their unique properties based on smaller transistors, offering exponential speed-ups in specific tasks like simulating molecules for drug discovery and optimizing large systems.",
        tags: ["Quantum Computing", "Computational Complexity"],
      },
      {
        id: "5",
        index: 1,
        type: "Lecture",
        title:
          "Quantum Computing: Challenges, Progress, and the Race for Quantum Supremacy",
        description:
          "In this lecture, we will delve into the fascinating world of quantum computing where algorithms aim to solve complex problems like finding an optimal way to visit multiple cities with minimal commute time. Despite being known as the 'traveling salesman's problem', these solutions have broader implications across various fields due to their versatility and efficiency in solving NP-hard problems, which are computationally intractable for classical computers.",
        tags: [
          "Quantum Computing",
          "Computer Science",
          "Data Structures & Algorithms",
        ],
      },
      {
        id: "6",
        index: 2,
        type: "Lecture",
        title:
          "Quantum Computing: Opportunities, Challenges, and the Path Forward",
        description:
          "In this lecture, we delve into the fascinating world of quantum computing\u2014a technology that has begun to permeate through various sectors despite its early stage. We explore how current systems are being utilized in specialized areas while acknowledging skepticism about widespread consumer availability and concerns over job obsolescence due to advanced computational capabilities. The discussion touches on the setup, configuration process of quantum computers\u2014a topic that remains somewhat enigmatic even among experts\u2014and highlights potential vulnerabilities in cryptography as we approach a future where these powerful machines become more prevalent.",
        tags: [
          "Quantum Computing",
          "Cryptography",
          "Efficiency and Algorithms",
          "System Design",
        ],
      },
      {
        id: "7",
        index: 1,
        type: "Lecture",
        title:
          "Frontend and Backend Development Lecture - A Comprehensive Guide to Building Interactive Web Applications",
        description:
          "In this lecture, we will delve into the intricain details of Frontend and Backend development with a focus on creating interactive web applications. We'll explore various technologies including React for frontend design using HTML, CSS, JavaScript, TypeScript, Node.js, Vue, Angular, as well as backend frameworks like Spring Boot, Django, Ruby, Ruby on Rails, Flutter, C++, Rust and Go Roadmap to build robust web applications from scratch.",
        tags: ["Frontend", "Backend"],
      },
    ],
  },
  {
    id: "621efe0cdc2ba109a3da2b88",
    name: "Quantum Computing",
    activities: [
      {
        id: "2",
        index: 0,
        type: "Lecture",
        title: "Technical Writing in the Software Industry",
        description:
          "In this lecture, we will explore the critical role of technical writing in the software industry. We will discuss how clear and concise documentation can enhance communication among developers, stakeholders, and end-users. The lecture will cover best practices for creating effective technical documents, including user manuals, API documentation, and internal knowledge bases. We will also examine common challenges faced by technical writers and strategies to overcome them, ensuring that complex technical information is accessible and understandable to a diverse audience.",
        tags: ["Technical Writing", "Documentation", "Software Industry"],
      },
    ],
  },

  {
    id: "67e5d77a360e42a2f2c76312",
    name: "Mastering Innovation Management",
    activities: [
      {
        id: "2",
        index: 0,
        type: "Lecture",
        title: "Technical Writing in the Software Industry",
        description:
          "In this lecture, we will explore the critical role of technical writing in the software industry. We will discuss how clear and concise documentation can enhance communication among developers, stakeholders, and end-users. The lecture will cover best practices for creating effective technical documents, including user manuals, API documentation, and internal knowledge bases. We will also examine common challenges faced by technical writers and strategies to overcome them, ensuring that complex technical information is accessible and understandable to a diverse audience.",
        tags: ["Technical Writing", "Documentation", "Software Industry"],
      },
    ],
  },
  {
    id: "657ca50a76635dbbe6e672e6",
    name: "Six Sigma: DMAIC Method for Effective Improvements",
    activities: [
      {
        id: "2",
        index: 0,
        type: "Lecture",
        title: "Technical Writing in the Software Industry",
        description:
          "In this lecture, we will explore the critical role of technical writing in the software industry. We will discuss how clear and concise documentation can enhance communication among developers, stakeholders, and end-users. The lecture will cover best practices for creating effective technical documents, including user manuals, API documentation, and internal knowledge bases. We will also examine common challenges faced by technical writers and strategies to overcome them, ensuring that complex technical information is accessible and understandable to a diverse audience.",
        tags: ["Technical Writing", "Documentation", "Software Industry"],
      },
    ],
  },
];

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
    index: 0,
    title: "Introduction to TypeScript",
    type: "Lecture",
    description: `## Introduction to TypeScript

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
  },
  {
    id: "2",
    index: 1,
    title: "Interfaces and Type Aliases",
    type: "Lecture",
    description: `## Interfaces and Type Aliases

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
  },
  {
    id: "3",
    index: 2,
    title: "TypeScript Basics Quiz",
    type: "Quiz",
    description: `## Quiz: TypeScript Basics

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
    index: 3,
    title: "Interfaces and Types Quiz",
    type: "Quiz",
    description: `## Quiz: Interfaces and Types

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
  },
];
