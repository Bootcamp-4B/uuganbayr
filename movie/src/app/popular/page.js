import PaginatedMoviePage from "@/components/PaginatedMoviePage";
import { getPopularMovies } from "@/lib/movie-lists";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function PopularPage({ searchParams }) {
  const movies = await getMovies();
  const popularMovies = getPopularMovies(movies);

  return (
    <PaginatedMoviePage
      basePath="/popular"
      movies={popularMovies}
      searchParams={searchParams}
      title="Popular Movies"
    />
  );
}
