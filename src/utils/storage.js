const APPLICATIONS_KEY = "careerpilot.applications.v1";
const PROFILE_KEY = "careerpilot.profile.v1";
const SETTINGS_KEY = "careerpilot.settings.v1";

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  getApplications: (fallback) => read(APPLICATIONS_KEY, fallback),
  saveApplications: (value) => write(APPLICATIONS_KEY, value),
  getProfile: (fallback) => read(PROFILE_KEY, fallback),
  saveProfile: (value) => write(PROFILE_KEY, value),
  getSettings: (fallback) => read(SETTINGS_KEY, fallback),
  saveSettings: (value) => write(SETTINGS_KEY, value),
  clearAll: () => {
    try {
      window.localStorage.removeItem(APPLICATIONS_KEY);
      window.localStorage.removeItem(PROFILE_KEY);
      window.localStorage.removeItem(SETTINGS_KEY);
      return true;
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = { APPLICATIONS_KEY, PROFILE_KEY, SETTINGS_KEY };
