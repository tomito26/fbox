import { FaHeart, FaPlay, FaStar } from 'react-icons/fa'
import { useState } from 'react';
import { Link } from 'react-router-dom';
const RecommendedMovie = ({ movie }) =>{
    const[isHovering,setIsHovering] = useState(-1);

    const baseUrl = "https://image.tmdb.org/t/p/original/";

    const releaseYear = movie.release_date.split("-");
    const year = releaseYear[0];
    console.log(isHovering)
    return(
        <div className="movie-card">
            <div className="movie-img">
                <Link to="/{movie.id}">
                    <img 
                        src={`${baseUrl}/${movie.poster_path}`} 
                        alt={movie.overview} 
                        onMouseOver={e =>setIsHovering(movie.id)} 
                        onMouseOut={()=>setIsHovering(-1)}
                        style={{filter:isHovering > 0 ? "brighter(50%)" : "brighter(60%)"}}
                    />
                </Link>
                <p className='movie-hd-tag'>HD</p>
            </div>
            <div className="movie-info">
                <p className="movie-title">{movie.title.length > 22 ? `${movie.title.substring(0,21)}...` : movie.title  }</p>
                <p className="movie-footer"><span className="year">{year}</span> <span className="movie-tag">movie</span></p> 
            </div>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <div className="movie-play-icon">
                        <p><FaPlay/></p>
                    </div>
                    <div className="movie-overview-wrapper">
                        <h3>{movie.title}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{movie.vote_average}</span>
                            <span>{year}</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p>{movie.overview.length  > 100 ? `${movie.overview.substring(0,100)}...` : movie.overview }</p>
                        <div className="overview-button">
                            <button className="watch-now-btn"><span className="watchnow-icon"><FaPlay className='watch-now-icon'/></span> Watch Now</button>
                            <p><FaHeart/></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RecommendedMovie; 