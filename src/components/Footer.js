import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";
import Img from "../logo.png";
import { NAV_GENRES } from "./categorySection/filterOptions";

// Reuse the navbar's genre source so footer genre links resolve to the same
// /browse discover queries (not the old text-search links).
const FOOTER_GENRE_LABELS = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"];
const footerGenres = NAV_GENRES.filter((g) => FOOTER_GENRE_LABELS.includes(g.label));

const socials = [
  { icon: <FaFacebookF />, label: "Facebook", href: "https://facebook.com" },
  { icon: <FaTwitter />, label: "Twitter", href: "https://twitter.com" },
  { icon: <FaInstagram />, label: "Instagram", href: "https://instagram.com" },
  { icon: <FaTelegram />, label: "Telegram", href: "https://telegram.org" },
  { icon: <FaWhatsapp />, label: "WhatsApp", href: "https://whatsapp.com" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={Img} alt="fbox logo" />
            <span>fbox.to</span>
          </div>
          <p className="footer-tagline">
            Stream movies &amp; series. Anytime, anywhere.
          </p>
          <div className="footer-socials">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="footer-social"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <div className="footer-col">
            <h4>Browse</h4>
            <ul>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/tvSeries">TV-Shows</Link></li>
              <li><Link to="/trendings">Most Watched</Link></li>
              <li><Link to="/topImdb">Top IMDb</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Genres</h4>
            <ul>
              {footerGenres.map((g) => (
                <li key={g.id}>
                  <Link to={`/browse?media=movie&genre=${g.id}&title=${encodeURIComponent(g.label)}`}>
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="mailto:support@fbox.to">Contact</a></li>
              <li><a href="mailto:support@fbox.to?subject=Title%20request">Request a title</a></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-about">
        <p>
          fbox is a demo streaming interface built on the TMDB API — browse
          trailers, cast and details for movies and series in one cinematic place.
        </p>
      </div>

      <div className="footer-bottom">
        <p>© {year} fbox.to · For educational / demo use only.</p>
        <ul className="footer-legal">
          <li><Link to="/terms">Terms</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/dmca">DMCA</Link></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
