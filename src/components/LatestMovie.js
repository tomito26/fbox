import { FaCircle, FaPlay, FaRegHeart, FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const LatestMovie = ({ movie }) => {
    const[isHovering,setIsHovering] = useState(-1);
    const[movieDetail,setMovieDetail] = useState({});

    useEffect(()=>{
        const getMovieDetail = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setMovieDetail(data)
        }
        getMovieDetail()
    },[])

    const baseUrl = "https://image.tmdb.org/t/p/original/";

    const releaseYear = !movie.release_date ? "" : movie.release_date.split("-");
    const year = releaseYear[0];
    
    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(movie.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className='movie-link' to={`/${movie.id}`}>
                <div className="movie-img">
                    <img 
                        src={`${baseUrl}/${movie.poster_path}`} 
                        alt={movie.overview} 
                    />
                    <p className='movie-hd-tag'>HD</p>
                    <div className="movie-info">
                    <p className="movie-title">{movie.title.length  > 25 ? `${movie.title.substring(0,23)}...` : movie.name}</p>
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
                    <div className="movie-play-icon">
                        <p><FaPlay/></p>
                    </div>
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
                            <button className="watch-now-btn">
                                <span>
                                    <FaPlay className='watchnow-icon'/>
                                </span> 
                                Watch Now
                            </button>
                            <p className="watchlist-icon">
                                <FaRegHeart/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestMovie;
