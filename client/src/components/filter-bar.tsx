import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AGE_RATINGS = ["G", "PG", "PG-13", "R", "NC-17", "Unrated"];
const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

interface FilterBarProps {
  selectedRating: string | null;
  selectedGenre: string | null;
  onRatingChange: (rating: string | null) => void;
  onGenreChange: (genre: string | null) => void;
  isKidsMode?: boolean;
}

export function FilterBar({
  selectedRating,
  selectedGenre,
  onRatingChange,
  onGenreChange,
  isKidsMode = false,
}: FilterBarProps) {
  const availableRatings = isKidsMode ? ["G", "PG"] : AGE_RATINGS;

  return (
    <div className="py-4 px-4 lg:px-8 space-y-4" data-testid="filter-bar">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>Filter by:</span>
      </div>

      {/* Age Rating Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Rating:</span>
        <Button
          variant={selectedRating === null ? "default" : "outline"}
          size="sm"
          onClick={() => onRatingChange(null)}
          className="h-7 px-3"
          data-testid="filter-rating-all"
        >
          All
        </Button>
        {availableRatings.map((rating) => (
          <Button
            key={rating}
            variant={selectedRating === rating ? "default" : "outline"}
            size="sm"
            onClick={() => onRatingChange(selectedRating === rating ? null : rating)}
            className={cn(
              "h-7 px-3",
              selectedRating === rating && "ring-2 ring-offset-2 ring-primary"
            )}
            data-testid={`filter-rating-${rating}`}
          >
            {rating}
          </Button>
        ))}
      </div>

      {/* Genre Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Genre:</span>
        <Button
          variant={selectedGenre === null ? "default" : "outline"}
          size="sm"
          onClick={() => onGenreChange(null)}
          className="h-7 px-3"
          data-testid="filter-genre-all"
        >
          All
        </Button>
        {GENRES.map((genre) => (
          <Badge
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all hover-elevate",
              selectedGenre === genre && "ring-2 ring-offset-2 ring-primary"
            )}
            onClick={() => onGenreChange(selectedGenre === genre ? null : genre)}
            data-testid={`filter-genre-${genre}`}
          >
            {genre}
          </Badge>
        ))}
      </div>
    </div>
  );
}
