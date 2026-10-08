import { demoProfile } from "../data/demoData.js";

const SKILL_ALIASES = {
  javascript: ["javascript", "js", "ecmascript"],
  typescript: ["typescript", "ts"],
  react: ["react", "react.js", "reactjs"],
  "node.js": ["node.js", "nodejs", "node"],
  mongodb: ["mongodb", "mongo db", "mongo"],
  html: ["html", "html5"],
  css: ["css", "css3", "tailwind", "tailwind css"],
  git: ["git", "github"],
  figma: ["figma"],
  "rest apis": ["rest api", "rest apis", "restful api", "restful apis"],
  redux: ["redux", "redux toolkit"],
  sql: ["sql", "mysql", "postgresql", "postgres"],
  python: ["python"],
  ux: ["ux", "user experience", "ux design", "user research"],
  "ui design": ["ui design", "user interface", "ui/ux", "ui ux"],
};

const ROLE_TERMS = [
  "frontend developer",
  "frontend engineer",
  "react developer",
  "ui developer",
  "full stack developer",
  "software engineer",
  "web developer",
  "product designer",
  "ui/ux designer",
  "ui ux designer",
];

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "are", "you", "your",
  "will", "our", "have", "has", "into", "about", "their", "they", "who", "what",
  "work", "team", "role", "job", "candidate", "experience", "skills", "years",
  "using", "looking", "strong", "good", "plus", "such", "than", "then", "must",
  "should", "can", "able", "all", "more", "least", "join", "company", "build",
]);

function normalized(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9+#./ -]/g, " ");
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function extractSkills(text) {
  const lower = normalized(text);
  return Object.entries(SKILL_ALIASES)
    .filter(([, aliases]) => containsAny(lower, aliases))
    .map(([canonical]) => canonical);
}

function extractRole(text) {
  const lower = normalized(text);
  return ROLE_TERMS.find((role) => lower.includes(role)) || null;
}

function extractExperience(text) {
  const match = normalized(text).match(/(\d+)\s*\+?\s*(?:years?|yrs?)/);
  return match ? Number(match[1]) : null;
}

function extractKeywords(text, skills) {
  const words = normalized(text)
    .split(/\s+/)
    .map((word) => word.replace(/^[^a-z0-9+#.]+|[^a-z0-9+#.]+$/g, ""))
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

  const counts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  const skillKeywords = skills.map((s) => s.toLowerCase());
  const frequent = Object.entries(counts)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .filter((word) => !skillKeywords.includes(word));

  return [...new Set([...skills, ...frequent])].slice(0, 14);
}

export function analyzeJobDescription(jobDescription) {
  const text = String(jobDescription || "").trim();
  if (!text) return null;

  const requiredSkills = extractSkills(text);
  const profileSkills = demoProfile.skills.map((skill) => skill.toLowerCase());
  const matchedSkills = requiredSkills.filter((skill) =>
    profileSkills.some((profileSkill) => {
      const p = profileSkill.toLowerCase();
      const aliases = SKILL_ALIASES[skill] || [skill];
      return aliases.includes(p) || p === skill;
    })
  );
  const missingSkills = requiredSkills.filter((skill) => !matchedSkills.includes(skill));

  const role = extractRole(text);
  const experienceRequired = extractExperience(text);
  const roleMatch = role
    ? [demoProfile.targetRole, demoProfile.secondaryRole]
        .filter(Boolean)
        .some((target) => {
          const targetLower = target.toLowerCase();
          return role.includes(targetLower.split(" ")[0]) || targetLower.includes(role.split(" ")[0]);
        })
    : null;

  const experienceAvailable = 3;
  const experienceMatch = experienceRequired == null ? null : experienceAvailable >= experienceRequired;

  let skillScore = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 70)
    : 42;
  const roleScore = roleMatch === null ? 10 : roleMatch ? 20 : 6;
  const experienceScore = experienceMatch === null ? 10 : experienceMatch ? 10 : 3;
  const matchPercentage = Math.min(100, skillScore + roleScore + experienceScore);

  const suggestions = [];
  if (missingSkills.length) {
    suggestions.push(`Strengthen ${missingSkills.slice(0, 3).join(", ")} before applying or prepare a clear learning plan.`);
  }
  if (roleMatch === false) {
    suggestions.push(`The detected role is “${role}”; emphasize transferable projects that connect it to your target role.`);
  }
  if (experienceMatch === false) {
    suggestions.push(`The description mentions ${experienceRequired}+ years; highlight your strongest relevant projects and outcomes.`);
  }
  if (!text.includes("portfolio") && (role?.includes("designer") || role?.includes("ui"))) {
    suggestions.push("Prepare a concise portfolio walkthrough with your design process and measurable outcomes.");
  }
  if (!suggestions.length) {
    suggestions.push("Tailor your resume summary and project bullets to mirror the strongest requirements in this description.");
  }

  const alignment = roleMatch === null
    ? "Role could not be confidently detected from the description."
    : roleMatch
      ? `Strong alignment with your ${demoProfile.targetRole} target. The description maps to your current focus.`
      : `Partial alignment. The detected role is ${role}, while your primary target is ${demoProfile.targetRole}.`;

  return {
    matchPercentage,
    requiredSkills,
    matchedSkills,
    missingSkills,
    keywords: extractKeywords(text, requiredSkills),
    role,
    experienceRequired,
    experienceAvailable,
    roleMatch,
    experienceMatch,
    alignment,
    suggestions,
  };
}
