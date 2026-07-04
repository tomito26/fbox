import { FaCircle, FaPlay, FaRegHeart, FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovie, imageUrl } from '../services/tmdb';

const LatestMovie = ({ movie }) => {
    const[isHovering,setIsHovering] = useState(-1);
    const[movieDetail,setMovieDetail] = useState({});

    useEffect(()=>{
        let active = true;
        getMovie(movie.id).then(({ data }) => {
            if (active && data) setMovieDetail(data);
        });
        return () => { active = false; };
    },[movie.id])

    const releaseYear = !movie.release_date ? "" : movie.release_date.split("-");
    const year = releaseYear[0];

    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(movie.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className='movie-link' to={`/movie/${movie.id}`}>
                <div className="movie-img">
                    <img
                        src={imageUrl(movie.poster_path, "w342")}
                        alt={movie.title}
                        loading="lazy"
                    />
                    <p className='movie-hd-tag'>HD</p>
                    <div className="movie-info">
                    <p className="movie-title">{movie.title.length  > 20 ? `${movie.title.substring(0,23)}...` : movie.title}</p>
                        <div className="movie-footer">
                            <p className="year">
                                <span>{year}</span>
                                <span className="dot"><FaCircle className="dot-circle"/></span>
                                <span>{ `${movieDetail.runtime} min`}</span>
                            </p>
                            <p className="movie-tag">Movie</p>
                        </div>
                    </div>
                </div>
            </Link>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <Link to={`/movie/${movie.id}`} className="movie-play-icon">
                        <p><FaPlay/></p>
                    </Link>
                    <div className="movie-overview-wrapper">
                        <h3>{movie.title}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{movieDetail.vote_average}</span>
                            <span>{year}</span>
                            <span>{`${movieDetail.runtime} min`}</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p className="movie-overview-details">{movie.overview.length  > 120 ? `${movie.overview.substring(0,120)}...` : movie.overview }</p>
                        <div className="country">
                            <h4>Country:</h4>
                           <p>
                                {!movieDetail.production_countries ? "" 
                                    : 
                                    movieDetail.production_countries.map((country,index)=>
                                    <span className="country-item" key={index} style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${country.name},`}
                                    </span>)
                                }
                            </p>    
                        </div>
                        <div className="genre">
                            <h4>Genre:</h4>
                            <p>
                                {!movieDetail.genres ? "" : movieDetail.genres.map(genre=>
                                    <span key={genre.id} className="genre-item" style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${genre.name},`}
                                    </span>)
                                }
                            </p>
                        </div>
                        <div className="overview-button">
                            <Link to={`/movie/${movie.id}`} className="watch-now-btn">
                                <span>
                                    <FaPlay className='watchnow-icon'/>
                                </span> 
                                Watch Now
                            </Link>
                            <button className="watchlist-icon" aria-label="Add to watchlist">
                                <FaRegHeart/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestMovie;
