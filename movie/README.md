# Movie Web Application

Beginner-friendly movie app made with Next.js.

## Pages

- Home
- Movie details
- Search
- Genre filter
- Loading page
- Mobile responsive layout

## How to run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To load the TMDB movie API, create `.env.local` and add either:

```bash
TMDB_API_KEY=your_api_key
```

or:

```bash
TMDB_ACCESS_TOKEN=your_read_access_token
```

## Main files

- `src/data/movies.js` - movie data
- `src/lib/tmdb.js` - TMDB movie API
- `src/components/MovieCard.js` - single movie card
- `src/components/MovieSection.js` - movie list section
- `src/app/page.js` - home page
- `src/app/search/page.js` - search page
- `src/app/genres/page.js` - genre filter page
- `src/app/globals.css` - all styles
