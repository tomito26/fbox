// Lightweight initial-circle avatar: a colored disc with the user's first
// initial. No image uploads — the background hue is derived deterministically
// from the name so it stays stable per user.
const hueFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const Avatar = ({ name = "", src = "", size = 32, className = "" }) => {
  const label = (name || "?").trim();
  const initial = label ? label[0].toUpperCase() : "?";
  const hue = hueFromName(label || "?");

  // A real photo when we have one; otherwise the deterministic initial circle.
  if (src) {
    return (
      <img
        className={`profile-avatar ${className}`.trim()}
        src={src}
        alt={label ? `${label}'s avatar` : "avatar"}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`profile-avatar ${className}`.trim()}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.45),
        background: `hsl(${hue}, 55%, 45%)`,
      }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
};

export default Avatar;
