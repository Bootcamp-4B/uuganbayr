import CinemaOrbit3D from "@/components/CinemaOrbit3D";
import MovieSection from "@/components/MovieSection";
import { getComingSoonMovies, getPopularMovies, getTopRatedMovies } from "@/lib/movie-lists";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const movies = await getMovies();
  const popularMovies = getPopularMovies(movies);
  const topRatedMovies = getTopRatedMovies(movies);
  const comingSoonMovies = getComingSoonMovies(movies);

  return (
    <main className="page">
      <CinemaOrbit3D movies={movies.slice(0, 10)} />

      <MovieSection title="Popular Movies" movies={popularMovies.slice(0, 18)} seeMoreHref="/popular" />
      <MovieSection title="Top Rated" movies={topRatedMovies.slice(0, 18)} seeMoreHref="/top-rated" />
      <MovieSection title="Coming Soon" movies={comingSoonMovies.slice(0, 18)} seeMoreHref="/coming-soon" />
    </main>
  );
}
