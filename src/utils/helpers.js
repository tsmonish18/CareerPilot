// Generates a reasonably-unique id for new applications created in the UI.
export function generateId() {
  return `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Picks a sensible default "next action" line based on status + any dates the
// user entered, so every application has something useful to show on cards
// and the dashboard even if the user didn't type one in Notes.
export function computeNextAction({ status, interviewDate, followUpDate }) {
  if (interviewDate) {
    const date = new Date(interviewDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `Interview on ${date}`;
  }
  if (followUpDate) {
    const date = new Date(followUpDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `Follow up on ${date}`;
  }
  switch (status) {
    case "Applied":
      return "Awaiting response";
    case "Shortlisted":
      return "Prepare for next round";
    case "Interview":
      return "Prepare for interview";
    case "Offer":
      return "Review offer letter";
    case "Rejected":
      return "Closed";
    default:
      return "";
  }
}

// Very light validation — good enough for a prototype without pulling in a
// form library. Returns an { field: message } object; empty object = valid.
export function validateApplication(values) {
  const errors = {};

  if (!values.company.trim()) errors.company = "Company name is required.";
  if (!values.role.trim()) errors.role = "Job role is required.";
  if (!values.location.trim()) errors.location = "Location is required.";
  if (!values.appliedDate) errors.appliedDate = "Application date is required.";

  if (values.jobUrl && !/^https?:\/\/.+\..+/i.test(values.jobUrl.trim())) {
    errors.jobUrl = "Enter a full URL, e.g. https://company.com/careers/123";
  }

  if (
    values.interviewDate &&
    values.appliedDate &&
    new Date(values.interviewDate) < new Date(values.appliedDate)
  ) {
    errors.interviewDate = "Interview date can't be before the application date.";
  }

  return errors;
}
