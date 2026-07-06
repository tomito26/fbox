// Lightweight stand-in for pages that are linked in the footer (Terms, Privacy,
// DMCA) but not yet written. Keeps those links real + accessible instead of
// dead "#" anchors, and can be swapped for real content later.
const Placeholder = ({ title }) => (
  <div className="placeholder-page">
    <h2>{title}</h2>
    <p>This page is coming soon.</p>
  </div>
);

export default Placeholder;
