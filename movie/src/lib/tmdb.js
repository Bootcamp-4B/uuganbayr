import axios from "axios";

const TMDB_MOVIE_IDS = [
  640146,
  502356,
  594767,
  76600,
  948713,
  677179,
  713704,
  638974,
  315162,
  603692,
  1048300,
  804150,
  1008005,
  700391,
  946310,
  1104040,
  758323,
  842945,
  849869,
  1033219,
  868759,
  934433,
  816904,
  980078,
  536554,
  631842,
  676710,
  758009,
  1101799,
  840326,
  1304313,
];
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = (process.env.TMDB_IMAGE_URL || "https://image.tmdb.org/t/p").replace(
  /\/$/,
  "",
);

function getTmdbAuth() {
  const accessToken = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (accessToken) {
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: "application/json",
      },
      apiKey: "",
    };
  }

  if (apiKey) {
    return {
      headers: {
        accept: "application/json",
      },
      apiKey,
    };
  }

  return null;
}

async function fetchTmdb(path, params = {}) {
  const auth = getTmdbAuth();

  if (!auth) {
    return null;
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  if (auth.apiKey) {
    url.searchParams.set("api_key", auth.apiKey);
  }

  try {
    const response = await axios.get(url.toString(), {
      headers: auth.headers,
      timeout: 10000,
    });

    return response.data;
  } catch {
    return null;
  }
}

function imageUrl(path, size = "w500") {
  return path ? `${TMDB_IMAGE_URL}/${size}${path}` : "";
}

function formatDuration(minutes) {
  if (!minutes) {
    return "Unknown";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getTrailer(videoResults = []) {
  return videoResults.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );
}

function mapTmdbMovie(movie) {
  const director = movie.credits?.crew?.find((person) => person.job === "Director");
  const writers =
    movie.credits?.crew
      ?.filter((person) => ["Writer", "Screenplay", "Story"].includes(person.job))
      .map((person) => person.name)
      .filter(Boolean)
      .slice(0, 3) || [];
  const cast =
    movie.credits?.cast
      ?.map((person) => person.name)
      .filter(Boolean)
      .slice(0, 3) || [];
  const trailer = getTrailer(movie.videos?.results);
  const genreNames = movie.genres?.map((genre) => genre.name).filter(Boolean) || [];

  return {
    id: movie.id,
    title: movie.title || movie.original_title || "Untitled",
    year: movie.release_date || "Coming soon",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    genre: genreNames[0] || "Drama",
    image: imageUrl(movie.poster_path, "w500"),
    cover: imageUrl(movie.backdrop_path || movie.poster_path, "original"),
    description: movie.overview || "No description available.",
    director: director?.name || "Unknown",
    writers: writers.join(" · ") || director?.name || "Unknown",
    duration: formatDuration(movie.runtime),
    trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    videoId: trailer?.key || "",
    cast: cast.length ? cast : ["Unknown"],
    tags: genreNames,
  };
}

export async function getTmdbMovieById(id) {
  const movie = await fetchTmdb(`/movie/${id}`, {
    append_to_response: "credits,videos",
  });

  return movie ? mapTmdbMovie(movie) : null;
}

export async function getTmdbMovies() {
  const movies = await Promise.all(
    TMDB_MOVIE_IDS.map((movieId) => getTmdbMovieById(movieId)),
  );

  return movies.filter(Boolean);
}

export { TMDB_MOVIE_IDS };
