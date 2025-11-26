import { useState } from "react";
import { Play, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  isKidsMode?: boolean;
}

export function MovieCard({ movie, onPlay, onInfo, isKidsMode = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "G":
        return "bg-green-600";
      case "PG":
        return "bg-blue-600";
      case "PG-13":
        return "bg-yellow-600";
      case "R":
        return "bg-red-600";
      case "NC-17":
        return "bg-red-800";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div
      className={cn(
        "relative aspect-[2/3] rounded-md overflow-visible cursor-pointer movie-card-hover group",
        isKidsMode && "rounded-xl"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`movie-card-${movie.id}`}
    >
      {/* Poster Image */}
      <div className="absolute inset-0 rounded-md overflow-hidden bg-card">
        {movie.posterUrl && !imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-muted">
            <div className="text-center p-4">
              <Play className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground line-clamp-2">{movie.title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Age Rating Badge */}
      <Badge
        className={cn(
          "absolute top-2 right-2 text-xs font-bold text-white border-0",
          getRatingColor(movie.ageRating)
        )}
        data-testid={`rating-badge-${movie.id}`}
      >
        {movie.ageRating}
      </Badge>

      {/* Hover Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/80 rounded-md flex flex-col justify-end p-3 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">
          {movie.title}
        </h3>
        
        {movie.year && (
          <p className="text-xs text-gray-400 mb-2">{movie.year}</p>
        )}

        {movie.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(movie);
            }}
            data-testid={`play-button-${movie.id}`}
          >
            <Play className="w-4 h-4 mr-1" />
            Play
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onInfo(movie);
            }}
            data-testid={`info-button-${movie.id}`}
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  isKidsMode?: boolean;
}

export function MovieRow({ title, movies, onPlay, onInfo, isKidsMode = false }: MovieRowProps) {
  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className={cn(
        "text-xl font-semibold mb-4 px-4 lg:px-8",
        isKidsMode && "text-2xl"
      )}>
        {title}
      </h2>
      <div className="scroll-row px-4 lg:px-8 gap-3">
        {movies.map((movie) => (
          <div key={movie.id} className={cn(
            "w-36 md:w-44 lg:w-48",
            isKidsMode && "w-44 md:w-52 lg:w-56"
          )}>
            <MovieCard
              movie={movie}
              onPlay={onPlay}
              onInfo={onInfo}
              isKidsMode={isKidsMode}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
