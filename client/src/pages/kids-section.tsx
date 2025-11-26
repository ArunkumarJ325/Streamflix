import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { MovieRow } from "@/components/movie-card";
import { MovieDetailsModal } from "@/components/movie-details-modal";
import { VideoPlayer } from "@/components/video-player";
import { HeroSkeleton, MovieRowSkeleton } from "@/components/loading-states";
import { useProfile } from "@/lib/profile-context";
import type { Movie } from "@shared/schema";
import { KIDS_SAFE_RATINGS } from "@shared/schema";

interface KidsSectionProps {
  onBack: () => void;
  onSwitchProfile: () => void;
}

export default function KidsSection({ onBack, onSwitchProfile }: KidsSectionProps) {
  const { isKidsMode } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

  const { data: movies = [], isLoading } = useQuery<Movie[]>({
    queryKey: ["/api/movies"],
  });

  // Filter to only show kids-safe content
  const kidsMovies = useMemo(() => {
    let filtered = movies.filter((m) =>
      KIDS_SAFE_RATINGS.includes(m.ageRating as any)
    );

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.genre.some((g) => g.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [movies, searchQuery]);

  // Group kids movies by category
  const animationMovies = kidsMovies.filter((m) =>
    m.genre.some((g) => g.toLowerCase() === "animation")
  );
  const familyMovies = kidsMovies.filter((m) =>
    m.genre.some((g) => g.toLowerCase() === "family")
  );
  const adventureMovies = kidsMovies.filter((m) =>
    m.genre.some((g) => g.toLowerCase() === "adventure")
  );
  const comedyMovies = kidsMovies.filter((m) =>
    m.genre.some((g) => g.toLowerCase() === "comedy")
  );

  const featuredMovie = kidsMovies[0] || null;

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
    <div
      className="min-h-screen bg-background"
      data-testid="kids-section-page"
    >
      {/* Colorful Kids Header */}
      <div className="fixed top-0 left-0 right-0 z-50 kids-gradient">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
              data-testid="button-exit-kids"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-yellow-300 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              STREAMFLIX KIDS
              <Sparkles className="w-6 h-6" />
            </h1>
          </div>
          <Button
            variant="ghost"
            onClick={onSwitchProfile}
            className="text-white hover:bg-white/20"
            data-testid="button-switch-profile-kids"
          >
            Switch Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {isLoading ? (
          <>
            <HeroSkeleton />
            <div className="mt-8 space-y-8">
              <MovieRowSkeleton title="Loading..." isKidsMode={true} />
              <MovieRowSkeleton title="Loading..." isKidsMode={true} />
            </div>
          </>
        ) : kidsMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">
              No Kids Movies Yet!
            </h2>
            <p className="text-lg text-gray-300 text-center max-w-md">
              Add some G or PG rated movies to your collection to see them here!
            </p>
            <Button
              size="lg"
              onClick={onBack}
              className="mt-8 bg-yellow-400 text-black hover:bg-yellow-300"
              data-testid="button-go-back"
            >
              Go Back
            </Button>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <HeroSection
              movie={featuredMovie}
              onPlay={handlePlay}
              onInfo={handleInfo}
              isKidsMode={true}
            />

            {/* Category Labels with Icons */}
            <div className="px-4 lg:px-8 py-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="font-medium text-white">Safe for Kids</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-pink-300" />
                  <span className="font-medium text-white">Family Friendly</span>
                </div>
              </div>
            </div>

            {/* Movie Rows */}
            <div className="pb-12 space-y-6">
              <MovieRow
                title="All Kids Movies"
                movies={kidsMovies.slice(0, 12)}
                onPlay={handlePlay}
                onInfo={handleInfo}
                isKidsMode={true}
              />

              {animationMovies.length > 0 && (
                <MovieRow
                  title="Animation"
                  movies={animationMovies}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                  isKidsMode={true}
                />
              )}

              {familyMovies.length > 0 && (
                <MovieRow
                  title="Family Fun"
                  movies={familyMovies}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                  isKidsMode={true}
                />
              )}

              {adventureMovies.length > 0 && (
                <MovieRow
                  title="Adventure"
                  movies={adventureMovies}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                  isKidsMode={true}
                />
              )}

              {comedyMovies.length > 0 && (
                <MovieRow
                  title="Funny Movies"
                  movies={comedyMovies}
                  onPlay={handlePlay}
                  onInfo={handleInfo}
                  isKidsMode={true}
                />
              )}
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
