import { useState } from "react";
import { Search, Baby, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileAvatar } from "./profile-avatar";
import { useProfile } from "@/lib/profile-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onSearch: (query: string) => void;
  onSwitchProfile: () => void;
  onKidsSection?: () => void;
  isKidsSection?: boolean;
}

export function Navbar({ onSearch, onSwitchProfile, onKidsSection, isKidsSection = false }: NavbarProps) {
  const { currentProfile, isKidsMode } = useProfile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm",
        isKidsSection && "kids-gradient"
      )}
      data-testid="navbar"
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight",
              isKidsMode ? "text-yellow-300" : "text-primary"
            )}
            data-testid="logo"
          >
            {isKidsMode ? "STREAMFLIX KIDS" : "STREAMFLIX"}
          </h1>

          {/* Navigation Links */}
          {!isKidsMode && (
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onKidsSection?.()}
                className={cn(
                  "text-sm font-medium transition-colors hover-elevate rounded px-2 py-1",
                  isKidsSection ? "text-white bg-primary" : "text-gray-300 hover:text-white"
                )}
                data-testid="link-kids"
              >
                <Baby className="w-4 h-4 inline mr-1" />
                Kids
              </button>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <div
              className={cn(
                "flex items-center transition-all duration-300",
                searchOpen ? "w-40 sm:w-56 md:w-64" : "w-10"
              )}
            >
              {searchOpen ? (
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-10 bg-black/50 border-white/30 text-white placeholder:text-gray-400"
                    autoFocus
                    data-testid="input-search"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      onSearch("");
                    }}
                    data-testid="button-close-search"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => setSearchOpen(true)}
                  className="text-white hover:bg-white/20"
                  data-testid="button-open-search"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>
          </form>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                data-testid="button-profile-menu"
              >
                <ProfileAvatar
                  avatarIndex={currentProfile?.avatarIndex ?? 0}
                  isKids={currentProfile?.isKids}
                  size="sm"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled className="font-medium">
                {currentProfile?.name || "Guest"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onSwitchProfile}
                data-testid="menu-item-switch-profile"
              >
                Switch Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onSwitchProfile}
                data-testid="menu-item-manage-profiles"
              >
                Manage Profiles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
