import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Profile } from "@shared/schema";

interface ProfileContextType {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  isKidsMode: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(() => {
    const saved = localStorage.getItem("currentProfile");
    return saved ? JSON.parse(saved) : null;
  });

  const isKidsMode = currentProfile?.isKids ?? false;

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem("currentProfile", JSON.stringify(currentProfile));
    } else {
      localStorage.removeItem("currentProfile");
    }
  }, [currentProfile]);

  return (
    <ProfileContext.Provider value={{ currentProfile, setCurrentProfile, isKidsMode }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
