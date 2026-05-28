function ratingValue(movie) {
  return Number(movie.rating) || 0;
}

function releaseTimestamp(movie) {
  if (!movie.year || movie.year === "Coming soon") {
    return 0;
  }

  const normalizedDate = String(movie.year).replace(/\./g, "-");
  const timestamp = Date.parse(normalizedDate);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getPopularMovies(movies) {
  return movies;
}

export function getTopRatedMovies(movies) {
  return [...movies].sort((firstMovie, secondMovie) => {
    return ratingValue(secondMovie) - ratingValue(firstMovie);
  });
}

export function getComingSoonMovies(movies) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...movies].sort((firstMovie, secondMovie) => {
    const firstTimestamp = releaseTimestamp(firstMovie);
    const secondTimestamp = releaseTimestamp(secondMovie);
    const firstIsFuture = firstTimestamp >= today.getTime();
    const secondIsFuture = secondTimestamp >= today.getTime();

    if (firstIsFuture !== secondIsFuture) {
      return firstIsFuture ? -1 : 1;
    }

    if (firstIsFuture) {
      return firstTimestamp - secondTimestamp;
    }

    return secondTimestamp - firstTimestamp;
  });
}
