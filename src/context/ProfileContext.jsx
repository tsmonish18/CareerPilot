import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { demoProfile } from "../data/demoData.js";
import { storage } from "../utils/storage.js";

const DEFAULT_SETTINGS = { compactMode: false, reminders: true, theme: "light" };
const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => storage.getProfile(demoProfile));
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...storage.getSettings(DEFAULT_SETTINGS) }));

  const updateProfile = useCallback((values) => {
    setProfile((prev) => {
      const next = { ...prev, ...values };
      storage.saveProfile(next);
      return next;
    });
  }, []);

  const updateSettings = useCallback((values) => {
    setSettings((prev) => {
      const next = { ...prev, ...values };
      storage.saveSettings(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ profile, settings, updateProfile, updateSettings }), [profile, settings, updateProfile, updateSettings]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}
