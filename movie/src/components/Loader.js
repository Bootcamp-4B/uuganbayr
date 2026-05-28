export default function Loader() {
  return (
    <div className="loading-shell">
      <div className="loading-hero">
        <div className="loading-copy">
          <span />
          <strong />
          <p />
        </div>
        <div className="loading-poster-row">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="loading-section">
        <span className="loading-title" />
        <div className="loading-grid">
          {Array.from({ length: 12 }, (_, index) => (
            <span className="loading-card" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
