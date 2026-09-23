import './styles.css';

// a curated palette that fits the neon theme, distinct enough that different
// usernames read as visually different avatars at a glance
const AVATAR_COLORS = ['#00ffff', '#ff00ff', '#39ff88', '#ffaa00', '#ff5577', '#66aaff'];

const colorForUsername = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// no image upload exists (or is asked for) anywhere in this app — a
// deterministic initial-and-color avatar is real, useful, and needs no
// storage or upload pipeline
const Avatar = ({ username, size = 48 }) => {
  const initial = username?.charAt(0).toUpperCase() || '?';
  const color = colorForUsername(username || '');

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        backgroundColor: color,
        borderColor: color
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
};

export default Avatar;
