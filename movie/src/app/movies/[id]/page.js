import Image from "next/image";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import TrailerButton from "@/components/TrailerButton";
import { getMovieById, getMovies } from "@/lib/movie-service";

export const dynamic = "force-dynamic";

function getYouTubeVideoId(url) {
  if (!url) {
    return "";
  }

  const parsedUrl = new URL(url);

  if (parsedUrl.hostname.includes("youtu.be")) {
    return parsedUrl.pathname.slice(1);
  }

  if (parsedUrl.pathname.startsWith("/embed/")) {
    return parsedUrl.pathname.split("/embed/")[1];
  }

  return parsedUrl.searchParams.get("v") || "";
}

export default async function MovieDetailsPage({ params }) {
  const movies = await getMovies();
  const movie = (await getMovieById(params.id)) || movies.find((item) => item.id === Number(params.id));
  const similarMovies = movies.filter((item) => item.id !== movie?.id).slice(0, 12);

  if (!movie) {
    return (
      <main className="page simple-page">
        <h1>Movie not found</h1>
        <Link href="/" className="primary-button">
          Back home
        </Link>
      </main>
    );
  }

  const movieTags = movie.tags || [movie.genre];
  const trailerVideoId = movie.videoId || getYouTubeVideoId(movie.trailer);

  return (
    <main className="details-page">
      <section className="details-hero">
        <Image
          src={movie.cover || movie.image}
          alt=""
          fill
          className="details-hero-backdrop"
          priority
        />
        <div className="details-hero-shade" />

        <div className="details-hero-content">
          <Image
            src={movie.image}
            alt={movie.title}
            width={220}
            height={330}
            className="details-poster"
            priority
          />

          <div className="details-hero-copy">
            <div className="details-title-row">
              <div>
                <h1>{movie.title}</h1>
                <p className="movie-meta">
                  {movie.year} · PG · {movie.duration}
                </p>
              </div>

              <div className="rating-box">
                <p>Rating</p>
                <strong>⭐ {movie.rating}<span>/10</span></strong>
              </div>
            </div>

            <div className="details-tags">
              {movieTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <p className="details-text">{movie.description}</p>

            <div className="details-hero-actions">
              <TrailerButton title={movie.title} videoId={trailerVideoId} />
            </div>
          </div>
        </div>
      </section>

      <section className="details-layout">
        <div className="movie-info-table">
          <div>
            <b>Director</b>
            <span>{movie.director}</span>
          </div>
          <div>
            <b>Writers</b>
            <span>{movie.writers || movie.director}</span>
          </div>
          <div>
            <b>Stars</b>
            <span>{movie.cast.join(" · ")}</span>
          </div>
        </div>

        <div className="more-heading">
          <h2>More like this</h2>
          <Link href="/popular">See more →</Link>
        </div>

        <div className="details-more-grid">
          {similarMovies.map((item) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
