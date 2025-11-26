import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RefreshCw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { MovieRow } from "@/components/movie-card";
import { MovieDetailsModal } from "@/components/movie-details-modal";
import { VideoPlayer } from "@/components/video-player";
import { FilterBar } from "@/components/filter-bar";
import { HeroSkeleton, MovieRowSkeleton } from "@/components/loading-states";
import { useProfile } from "@/lib/profile-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Movie } from "@shared/schema";
import { KIDS_SAFE_RATINGS } from "@shared/schema";

interface BrowseProps {
  onSwitchProfile: () => void;
  onGoToKids?: () => void;
}

export default function Browse({ onSwitchProfile, onGoToKids }: BrowseProps) {
  const { currentProfile, isKidsMode } = useProfile();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: movies = [], isLoading, refetch } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  const scanMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/movies/scan"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/movies"] });
      toast({
        title: "Scan Complete",
        description: "Movie library has been refreshed",
      });
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Could not scan movie directory",
        variant: "destructive",
      });
    },
  });

  // Filter movies based on profile type and filters
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // Apply kids mode filter
    if (isKidsMode) {
      filtered = filtered.filter((m) =>
        KIDS_SAFE_RATINGS.includes(m.ageRating as any)
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.genre.some((g) => g.toLowerCase().includes(query))
      );
    }

    // Apply rating filter
    if (selectedRating) {
      filtered = filtered.filter((m) => m.ageRating === selectedRating);
    }

    // Apply genre filter
    if (selectedGenre) {
      filtered = filtered.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    return filtered;
  }, [movies, isKidsMode, searchQuery, selectedRating, selectedGenre]);

  // Group movies by genre for display
  const moviesByGenre = useMemo(() => {
    const genreMap = new Map<string, Movie[]>();
    
    filteredMovies.forEach((movie) => {
      movie.genre.forEach((genre) => {
        if (!genreMap.has(genre)) {
          genreMap.set(genre, []);
        }
        genreMap.get(genre)!.push(movie);
      });
    });

    // Sort genres by number of movies
    return Array.from(genreMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 6); // Limit to 6 genres
  }, [filteredMovies]);

  // Get featured movie for hero section
  const featuredMovie = filteredMovies[0] || null;

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
  };

  const handleInfo = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Full screen video player
  if (playingMovie) {
    return (
      <VideoPlayer
        movie={playingMovie}
        onBack={() => setPlayingMovie(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="browse-page">
      <Navbar
        onSearch={setSearchQuery}
        onSwitchProfile={onSwitchProfile}
        onKidsSection={onGoToKids}
        isKidsSection={false}
      />

      {/* Main Content */}
      <main className="pt-16">
        {isLoading ? (
          <>
            <HeroSkeleton />
            <div className="mt-8 space-y-8">
              <MovieRowSkeleton title="Loading..." isKidsMode={isKidsMode} />
              <MovieRowSkeleton title="Loading..." isKidsMode={isKidsMode} />
            </div>
          </>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
            <FolderOpen className="w-24 h-24 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Movies Found</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              {searchQuery || selectedRating || selectedGenre
                ? "No movies match your current filters. Try adjusting your search."
                : "Scan your movie folder to discover your collection. Place your video files in the 'movies' folder."}
            </p>
            <Button
              size="lg"
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending}
              data-testid="button-scan-movies"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${scanMutation.isPending ? "animate-spin" : ""}`} />
              {scanMutation.isPending ? "Scanning..." : "Scan Movies"}
            </Button>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              movie={featuredMovie}
              onPlay={handlePlay}
              onInfo={handleInfo}
              isKidsMode={isKidsMode}
            />

            {/* Filter Toggle */}
            <div className="px-4 lg:px-8 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scanMutation.mutate()}
                disabled={scanMutation.isPending}
                className="ml-2"
                data-testid="button-refresh-movies"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${scanMutation.isPending ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {/* Filter Bar */}
            {showFilters && (
              <FilterBar
                selectedRating={selectedRating}
                selectedGenre={selectedGenre}
                onRatingChange={setSelectedRating}
                onGenreChange={setSelectedGenre}
                isKidsMode={isKidsMode}
              />
            )}

            {/* Movie Rows by Genre */}
            <div className="pb-12 space-y-4">
              {/* All Movies Row */}
              <MovieRow
                title={isKidsMode ? "All Kids Movies" : "All Movies"}
                movies={filteredMovies.slice(0, 12)}
                onPlay={handlePlay}
                onInfo={handleInfo}
                isKidsMode={isKidsMode}
              />

              {/* Genre-based Rows */}
              {moviesByGenre.map(([genre, genreMovies]) => (
                <MovieRow
                  key={genre}
                  title={genre}
                  movies={genreMovies.slice(0, 12)}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                  isKidsMode={isKidsMode}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onPlay={handlePlay}
      />
    </div>
  );
}
