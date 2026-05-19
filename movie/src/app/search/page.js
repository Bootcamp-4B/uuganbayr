import SearchClient from "@/components/SearchClient";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const movies = await getMovies();

  return <SearchClient movies={movies} />;
}
