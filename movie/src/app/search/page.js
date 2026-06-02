import SearchClient from "@/components/SearchClient";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const movies = await getMovies();
  const initialQuery = typeof searchParams?.q === "string" ? searchParams.q : "";

  return <SearchClient initialQuery={initialQuery} movies={movies} />;
}
