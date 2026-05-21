import HeroCarousel from "@/components/HeroCarousel";
import MovieSection from "@/components/MovieSection";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="page">
      <HeroCarousel movies={movies.slice(0, 3)} />

      <MovieSection title="Popular Movies" movies={movies.slice(0, 8)} />
      <MovieSection title="Top Rated" movies={movies.slice(3, 9)} />
      <MovieSection title="Coming Soon" movies={movies.slice(1, 7)} />
    </main>
  );
}
