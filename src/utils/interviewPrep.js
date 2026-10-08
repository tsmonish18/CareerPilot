const ROLE_QUESTION_BANK = {
  frontend: [
    "How would you structure a scalable React application for this product?",
    "How do you improve the performance of a React page with many components?",
    "Explain how you would handle API loading, error and empty states.",
    "What is the difference between controlled and uncontrolled React components?",
    "How would you test a reusable UI component?",
  ],
  designer: [
    "Walk me through your design process from problem discovery to handoff.",
    "How do you validate that a design solves the user's actual problem?",
    "How do you balance usability, business goals and visual quality?",
    "Tell me about a design decision you changed after user feedback.",
    "How do you maintain consistency with a design system?",
  ],
  fullstack: [
    "How would you design the API and data model for a job-tracking application?",
    "How would you secure authentication and protected API routes?",
    "How would you debug a slow full-stack request?",
    "When would you choose SQL versus MongoDB for a new product?",
    "How would you deploy and monitor a React + Node application?",
  ],
};

const BEHAVIORAL = [
  "Tell me about yourself and why this role interests you.",
  "Tell me about a difficult project and how you handled it.",
  "Describe a time you received critical feedback.",
  "Tell me about a disagreement with a teammate and how you resolved it.",
  "What is a recent skill you learned and how did you apply it?",
];

function bankFor(role = "") {
  const r = role.toLowerCase();
  if (r.includes("designer") || r.includes("ux") || r.includes("ui")) return ROLE_QUESTION_BANK.designer;
  if (r.includes("full stack") || r.includes("fullstack")) return ROLE_QUESTION_BANK.fullstack;
  return ROLE_QUESTION_BANK.frontend;
}

export function generateInterviewPrep(application, profile) {
  const roleQuestions = bankFor(application.role);
  const skillQuestions = (application.skills || []).slice(0, 6).map((skill) => `Explain your practical experience with ${skill} and describe one project where you used it.`);
  const questions = [...roleQuestions, ...skillQuestions, ...BEHAVIORAL];
  const unique = [...new Map(questions.map((q) => [q, q])).values()];
  const experience = profile?.experience || "your experience";
  return {
    questions: unique,
    focusAreas: [
      `Prepare a 60–90 second introduction focused on ${application.role}.`,
      `Prepare two project stories that demonstrate ${application.skills?.slice(0, 3).join(", ") || "the required skills"}.`,
      `Connect your ${experience} to measurable outcomes and responsibilities.`,
    ],
  };
}
