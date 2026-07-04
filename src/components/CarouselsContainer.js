import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { FaPlay, FaRegHeart, FaStar } from 'react-icons/fa';
import { getList, imageUrl } from '../services/tmdb';

const CarouselContainer = () => {
  const [carouselMovies, setCarouselMovies] = useState([]);

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
    <Carousel className="carousel-wrapper" controls={false}>
      {carouselMovies.map((item, index) => (
        <Carousel.Item interval={3000} className="wrapper" key={item.id}>
          <img
            className="d-block w-100 img-fluid"
            src={imageUrl(item.backdrop_path, 'w1280')}
            alt={item.title || item.name || `Slide ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <Carousel.Caption className="ca-caption">
            <h3>{item.title || item.name}</h3>
            <div className="movie-details">
              <p>HD</p>
              <p className="rating">
                <span className="star"><FaStar /></span>
                <span className="voting-average">{item.vote_average}</span>
              </p>
              <p>{item.media_type}</p>
            </div>
            <p>{item.overview}</p>
            <div className="watch">
              <button className="play"><FaPlay className="play-icon" />Watch now</button>
              <button className="add-watchlist"><FaRegHeart className="heart" />Add to list</button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselContainer;
