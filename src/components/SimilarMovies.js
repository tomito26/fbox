import { useEffect, useState } from "react";
import { Link,Navigate } from "react-router-dom";
import { FaCircle,FaPlay, FaRegHeart, FaStar } from "react-icons/fa";

const SimilarMovies = ({ similarMovie }) =>{
    const [similarMovieDetail,setSimilarMovieDetail] = useState({});
    const [isHovering,setIsHovering] = useState(-1);
    useEffect(()=>{
        const getSimilarMovieDetails = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/movie/${similarMovie.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setSimilarMovieDetail(data)
        }
        getSimilarMovieDetails();
    })
    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const releaseDate = similarMovie.release_date;
    const year = releaseDate.split("-");
    console.log(year)
    return(
        <div className="similar-movie-container" onMouseOver={e =>setIsHovering(similarMovieDetail.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="similar-movie-link" to={`/${similarMovie.id}`}>
                <div className="similar-movie-poster">
                    <img 
                        src={`${baseUrl}/${similarMovie.poster_path}`} 
                        alt={similarMovie.title}
                        style={{filter:isHovering < 0 ? "brightness(100%)" : "brightness(50%)"}} 
                    />
                </div>
                <div className="similar-movie-footer">
                    <p className="movie-title">{similarMovie.title.length > 14  ? `${similarMovie.title.substring(0,13)}...` : similarMovie.title}</p>
                    <div className="movie-footer-details">
                        <p className="movie-time">
                            <span>
                                {year[0]}
                            </span>
                            <FaCircle className="circle-dot"/>
                            <span className="runtime">
                                {`${similarMovieDetail.runtime} min`}
                            </span>
                        </p>  
                        <p className="movie-tag">Movie</p>
                    </div>
                </div>
            </Link>
            <div className={isHovering > 0 ?  `similar-movie-overview` : "no-hover"}>
                <div className="similar-movie-play">
                    <FaPlay/>
                </div>
                <div className="similar-movie-overview-info">
                    <div className="similar-movie-overview-header">
                        <h4>{similarMovie.title}</h4>
                        <p className="similar-movie-rate"><FaStar className="star-rate"/>{similarMovie.vote_average}</p>
                        <p className="similar-movie-runtime">{`${similarMovieDetail.runtime} min`}</p>
                        <p className="similar-movie-tag">HD</p>
                    </div>
                    <div className="similar-movie-overview-details">
                        <p>{similarMovie.overview.length > 150 ? `${similarMovie.overview.substring(0,150)}...`: similarMovie.overview}</p>
                    </div>
                    <div className="category-section">
                        <h4>Country:</h4>
                        <p>{!similarMovieDetail.production_countries ? "" : similarMovieDetail.production_countries.map((country,index) => <span key={index} style={{marginRight:"3px"}}>{country.name}</span>)}</p>
                    </div>
                    <div className="category-section">
                        <h4>Genre:</h4>
                        <p>{!similarMovieDetail.genres ? "" : similarMovieDetail.genres.map((genre,index) => <span key={genre.id} style={{marginRight:"3px"}}>{`${genre.name},`}</span>)}</p>
                    </div>
                    <div className="similar-button">
                        <button className="watchnow-btn"><FaPlay className="similar-movies-play"/>Watch Now</button>
                        <button className="add-to-list"><FaRegHeart className="heart"/></button>
                    </div>
                </div>
            </div>
           

        </div>
    );
};

export default SimilarMovies;