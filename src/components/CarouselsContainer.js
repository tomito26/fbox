import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaPlay, FaRegHeart, FaStar } from 'react-icons/fa';
import { getList, imageUrl } from '../services/tmdb';
import { useWatchlist } from '../Context/WatchlistContext';

// Build the detail-page path for a trending item (which mixes movies and TV).
const detailPath = (item) =>
  `/${(item.media_type === 'tv' ? 'tvshows' : 'movie')}/${item.id}`;

const CarouselContainer = () => {
  const [carouselMovies, setCarouselMovies] = useState([]);
  const { isSaved, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getList('/trending/all/day').then(({ data }) => {
      if (active && data) setCarouselMovies(data.slice(0, 11));
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Carousel className="carousel-wrapper" fade controls={false} interval={6500} pause="hover">
      {carouselMovies.map((item, index) => {
        const title = item.title || item.name;
        const saved = isSaved(item.id);
        const rating =
          item.vote_average != null ? Number(item.vote_average).toFixed(1) : '';
        return (
          <Carousel.Item className="wrapper" key={item.id}>
            {/* Slide backdrop links straight to the detail page. Eager-loaded:
                these live inside display:none slides where loading="lazy" would
                never fire, leaving the hero blank as it rotates. */}
            <Link to={detailPath(item)} className="hero-image-link">
              <img
                className="d-block w-100 img-fluid"
                src={imageUrl(item.backdrop_path, 'w1280')}
                alt={title || `Slide ${index + 1}`}
              />
              <span className="hero-scrim" />
            </Link>
            <Carousel.Caption className="ca-caption">
              <Link to={detailPath(item)} className="hero-title-link">
                <h3>{title}</h3>
              </Link>
              <div className="movie-details">
                <p>HD</p>
                {rating && (
                  <p className="rating">
                    <span className="star"><FaStar /></span>
                    <span className="voting-average">{rating}</span>
                  </p>
                )}
                <p>{item.media_type === 'tv' ? 'TV' : 'Movie'}</p>
              </div>
              <p className="hero-overview">{item.overview}</p>
              <div className="watch">
                <button className="play" onClick={() => navigate(detailPath(item))}>
                  <FaPlay className="play-icon" />Watch now
                </button>
                <button
                  className={`add-watchlist${saved ? ' saved' : ''}`}
                  aria-pressed={saved}
                  onClick={() => toggleWatchlist(item)}
                >
                  {saved ? <FaHeart className="heart" /> : <FaRegHeart className="heart" />}
                  {saved ? 'In your list' : 'Add to list'}
                </button>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default CarouselContainer;
