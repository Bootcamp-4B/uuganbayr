"use client";

import { useState } from "react";

export default function TrailerButton({ title, videoId }) {
  const [showTrailer, setShowTrailer] = useState(false);

  return (
    <>
      <button className="play-trailer" onClick={() => setShowTrailer(true)}>
        <span>▶</span>
        Play trailer · 2:35
      </button>

      {showTrailer && (
        <div className="trailer-modal">
          <div className="trailer-modal-box">
            <div className="trailer-modal-header">
              <h2>{title}: Trailer 2</h2>
              <button onClick={() => setShowTrailer(false)}>×</button>
            </div>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`${title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
