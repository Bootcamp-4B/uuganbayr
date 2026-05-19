import GenresClient from "@/components/GenresClient";
import { genres } from "@/data/movies";
import { getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

export default async function GenresPage() {
  const movies = await getMovies();

  return <GenresClient genres={genres} movies={movies} />;
}
