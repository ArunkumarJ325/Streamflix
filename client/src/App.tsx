import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileProvider, useProfile } from "@/lib/profile-context";
import ProfileSelection from "@/pages/profile-selection";
import Browse from "@/pages/browse";
import KidsSection from "@/pages/kids-section";

type AppView = "profile-selection" | "browse" | "kids";

function AppContent() {
  const { currentProfile, setCurrentProfile } = useProfile();
  const [view, setView] = useState<AppView>("profile-selection");

  useEffect(() => {
    if (currentProfile && view === "profile-selection") {
      setView("browse");
    }
  }, [currentProfile]);

  const handleSwitchProfile = () => {
    setCurrentProfile(null);
    setView("profile-selection");
  };

  const handleGoToKids = () => {
    setView("kids");
  };

  // If no profile selected, show profile selection
  if (!currentProfile || view === "profile-selection") {
    return <ProfileSelection />;
  }

  // If viewing kids section
  if (view === "kids") {
    return (
      <KidsSection
        onBack={() => setView("browse")}
        onSwitchProfile={handleSwitchProfile}
      />
    );
  }

  // Main browse view
  return (
    <Browse
      onSwitchProfile={handleSwitchProfile}
      onGoToKids={handleGoToKids}
    />
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProfileProvider>
          <AppContent />
          <Toaster />
        </ProfileProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
