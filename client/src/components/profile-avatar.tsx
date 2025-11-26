import { User, Smile, Star, Heart, Music, Film, Gamepad2, BookOpen, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_CONFIGS = [
  { bg: "bg-red-500", Icon: User },
  { bg: "bg-blue-500", Icon: Smile },
  { bg: "bg-green-500", Icon: Star },
  { bg: "bg-yellow-500", Icon: Heart },
  { bg: "bg-purple-500", Icon: Music },
  { bg: "bg-pink-500", Icon: Film },
  { bg: "bg-orange-500", Icon: Gamepad2 },
  { bg: "bg-cyan-500", Icon: BookOpen },
];

interface ProfileAvatarProps {
  avatarIndex: number;
  isKids?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ProfileAvatar({ avatarIndex, isKids = false, size = "md", className }: ProfileAvatarProps) {
  const config = AVATAR_CONFIGS[avatarIndex] || AVATAR_CONFIGS[0];
  const Icon = isKids ? Baby : config.Icon;
  
  const sizeClasses = {
    sm: "w-10 h-10 sm:w-12 sm:h-12",
    md: "w-16 h-16 sm:w-20 sm:h-20",
    lg: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32",
    xl: "w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40",
  };

  const iconSizes = {
    sm: "w-5 h-5 sm:w-6 sm:h-6",
    md: "w-8 h-8 sm:w-10 sm:h-10",
    lg: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    xl: "w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20",
  };

  return (
    <div
      className={cn(
        "rounded-md flex items-center justify-center transition-all duration-200",
        config.bg,
        sizeClasses[size],
        isKids && "ring-4 ring-yellow-400",
        className
      )}
    >
      <Icon className={cn("text-white", iconSizes[size])} />
    </div>
  );
}

interface AvatarPickerProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  isKids?: boolean;
}

export function AvatarPicker({ selectedIndex, onSelect, isKids = false }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {AVATAR_CONFIGS.map((config, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center transition-all duration-200 hover-elevate",
            config.bg,
            selectedIndex === index && "ring-2 sm:ring-4 ring-white scale-105 sm:scale-110"
          )}
          data-testid={`avatar-option-${index}`}
        >
          {isKids ? (
            <Baby className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          ) : (
            <config.Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          )}
        </button>
      ))}
    </div>
  );
}
