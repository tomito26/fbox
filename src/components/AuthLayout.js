import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getList, imageUrl } from '../services/tmdb';

/**
 * Cinematic split-screen shell for the auth pages (Login / Register /
 * ForgotPassword). Left panel is a full-bleed TMDB backdrop — the same source
 * the homepage hero uses — under the hero's scrim treatment; right panel holds
 * the form passed as children. On narrow screens the artwork collapses (CSS)
 * and the form goes full-width.
 */
const AuthLayout = ({ title, subtitle, children }) => {
  const [art, setArt] = useState(null);

  useEffect(() => {
    let active = true;
    getList('/trending/all/day').then(({ data }) => {
      if (!active || !data || !data.length) return;
      // Pick a random backdrop so the entry moment feels fresh each visit.
      const withArt = data.filter((i) => i.backdrop_path);
      const pick = withArt[Math.floor(Math.random() * withArt.length)] || data[0];
      setArt({
        src: imageUrl(pick.backdrop_path, 'w1280'),
        title: pick.title || pick.name || '',
      });
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="auth-page">
      <aside className="auth-art">
        {art && (
          <img className="auth-art-img" src={art.src} alt={art.title} />
        )}
        <span className="auth-art-scrim" />
        <div className="auth-art-content">
          <Link to="/" className="auth-brand">fbox</Link>
          <p className="auth-tagline">
            Unlimited movies &amp; shows. Your next watch is one click away.
          </p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-panel-inner">
          <Link to="/" className="auth-brand auth-brand--mobile">fbox</Link>
          <h2 className="auth-title">{title}</h2>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
