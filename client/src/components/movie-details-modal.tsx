import { X, Play, Clock, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Movie } from "@shared/schema";
import { cn } from "@/lib/utils";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

export function MovieDetailsModal({ movie, isOpen, onClose, onPlay }: MovieDetailsModalProps) {
  if (!movie) return null;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "G":
        return "bg-green-600 text-white";
      case "PG":
        return "bg-blue-600 text-white";
      case "PG-13":
        return "bg-yellow-600 text-white";
      case "R":
        return "bg-red-600 text-white";
      case "NC-17":
        return "bg-red-800 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden bg-card border-card-border"
        data-testid="movie-details-modal"
      >
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-card">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover opacity-30"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-20 h-20 text-muted-foreground opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-white">
                {movie.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Movie details for {movie.title}
              </DialogDescription>
            </DialogHeader>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={cn("text-sm font-bold border-0", getRatingColor(movie.ageRating))}>
              {movie.ageRating}
            </Badge>
            {movie.year && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{movie.year}</span>
              </div>
            )}
            {movie.duration && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} min</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <Badge key={g} variant="secondary">
                  {g}
                </Badge>
              ))}
            </div>
          )}

          {/* Description */}
          {movie.description && (
            <p className="text-foreground leading-relaxed">
              {movie.description}
            </p>
          )}

          {/* Content Warnings */}
          {movie.contentWarnings.length > 0 && (
            <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-semibold text-destructive">Content Warnings</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.contentWarnings.map((warning) => (
                  <Badge key={warning} variant="outline" className="border-destructive/50 text-destructive">
                    {warning}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* File Info */}
          <div className="text-sm text-muted-foreground">
            <p className="truncate">File: {movie.fileName}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={() => onPlay(movie)}
              data-testid="button-play-movie"
            >
              <Play className="w-5 h-5 mr-2" />
              Play Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
