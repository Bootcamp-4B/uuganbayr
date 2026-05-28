import PaginatedMoviePage from "@/components/PaginatedMoviePage";
import { getComingSoonMovies } from "@/lib/movie-lists";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function ComingSoonPage({ searchParams }) {
  const movies = await getMovies();
  const comingSoonMovies = getComingSoonMovies(movies);

  return (
    <PaginatedMoviePage
      basePath="/coming-soon"
      movies={comingSoonMovies}
      searchParams={searchParams}
      title="Coming Soon"
    />
  );
}
