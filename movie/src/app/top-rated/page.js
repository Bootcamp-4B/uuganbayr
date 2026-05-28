import PaginatedMoviePage from "@/components/PaginatedMoviePage";
import { getTopRatedMovies } from "@/lib/movie-lists";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function TopRatedPage({ searchParams }) {
  const movies = await getMovies();
  const topRatedMovies = getTopRatedMovies(movies);

  return (
    <PaginatedMoviePage
      basePath="/top-rated"
      movies={topRatedMovies}
      searchParams={searchParams}
      title="Top Rated"
    />
  );
}
