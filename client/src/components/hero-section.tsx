import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  movie: Movie | null;
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  isKidsMode?: boolean;
}

export function HeroSection({ movie, onPlay, onInfo, isKidsMode = false }: HeroSectionProps) {
  if (!movie) {
    return (
      <div
        className={cn(
          "relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center",
          isKidsMode
            ? "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
            : "bg-gradient-to-br from-card via-background to-card"
        )}
        data-testid="hero-section-empty"
      >
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {isKidsMode ? "Welcome to Kids Zone!" : "No Movies Found"}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">
            {isKidsMode
              ? "Add some kid-friendly movies to get started!"
              : "Scan your movie folder to discover your collection"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden" data-testid="hero-section">
      {/* Background Image */}
      <div className="absolute inset-0">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full",
              isKidsMode
                ? "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"
                : "bg-gradient-to-br from-primary/30 via-background to-card"
            )}
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end sm:items-center px-4 lg:px-8 pb-6 sm:pb-0">
        <div className="max-w-2xl space-y-2 sm:space-y-4">
          {/* Title */}
          <h1
            className={cn(
              "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg",
              isKidsMode && "text-yellow-300"
            )}
            data-testid="hero-title"
          >
            {movie.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge
              className={cn(
                "text-sm font-bold border-0",
                movie.ageRating === "G" || movie.ageRating === "PG"
                  ? "bg-green-600"
                  : movie.ageRating === "PG-13"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              )}
            >
              {movie.ageRating}
            </Badge>
            {movie.year && (
              <span className="text-gray-300">{movie.year}</span>
            )}
            {movie.duration && (
              <span className="text-gray-300">{movie.duration} min</span>
            )}
          </div>

          {/* Genres */}
          {movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genre.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {movie.description && (
            <p className="hidden sm:block text-base md:text-lg text-gray-200 line-clamp-2 md:line-clamp-3 max-w-xl">
              {movie.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 sm:gap-4 pt-2 sm:pt-4">
            <Button
              size="default"
              onClick={() => onPlay(movie)}
              className="px-4 sm:px-8"
              data-testid="hero-play-button"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Play
            </Button>
            <Button
              size="default"
              variant="secondary"
              onClick={() => onInfo(movie)}
              className="px-4 sm:px-8 bg-white/20 text-white border-0 hover:bg-white/30"
              data-testid="hero-info-button"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">More </span>Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
