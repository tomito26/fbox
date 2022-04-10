import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegHeart,FaPlay,FaCircle,FaStar } from "react-icons/fa"; 

const MovieShow = ({movieShow}) =>{
    const[movieShowDetails,setMovieShowDetails] = useState({});
    const[isHovering,setIsHovering] = useState(-1);

    useEffect(()=>{
        const getMovieShowDetails = async () =>{
            const rest = movieShow.media_type === "movie" ? await fetch(`https://api.themoviedb.org/3/movie/${movieShow.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`) : await fetch(`https://api.themoviedb.org/3/tv/${movieShow.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setMovieShowDetails(data)
        };  
        getMovieShowDetails();
    },[]);
    // console.log(movieShow)

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const seriesReleaseDate =movieShow.first_air_date;
    // console.log(`${seriesReleaseDate} ~ series`)
    // console.log(`${movieShow.release_date} ~ movies`)
    const movieReleaseDate =  !movieShow.release_date ? seriesReleaseDate.split("-")[0] : movieShow.release_date.split("-")[0];

    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(movieShow.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="movie-link" to={`/${movieShow.id}`}>
                <div className="movie-img">
                    <img src={`${baseUrl}/${movieShow.poster_path}`} alt={movieShow.name} />
                    <p className='movie-hd-tag'>HD</p>
                </div>
                <div className="movie-info">
                    <p className="movie-title">
                        {!movieShow.title ? movieShow.name.length > 25 ? `${movieShow.name.substring(0,23)}...`:movieShow.name 
                            :
                            movieShow.title.length > 20 ? `${movieShow.title.substring(0,21)}...`:movieShow.title }
                    </p>
                    <div className="movie-footer">
                        <p className="year">
                            <span>{movieShow.media_type === "movie" ? movieReleaseDate : `SS ${movieShowDetails.number_of_seasons}`}</span>
                            <span className="dot"><FaCircle className="dot-circle"/></span>
                            <span>{movieShow.media_type === "movie" ? `${movieShowDetails.runtime} min` : `EP ${!movieShowDetails.last_episode_to_air ? "" : movieShowDetails.last_episode_to_air.episode_number}`}</span>
                        </p>
                        <p className="movie-tag">{movieShow.media_type}</p>
                    </div>
                </div>
            </Link>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <div className="movie-play-icon">
                        <p><FaPlay/></p>
                    </div>
                    <div className="movie-overview-wrapper">
                        <h3>{movieShow.name || movieShow.title}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{movieShow.vote_average}</span>
                            <span>{movieReleaseDate}</span>
                            <span>{movieShow.media_type === "movie" ? `${movieShowDetails.runtime} min` : `na min`}</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p className="movie-overview-details">
                            {movieShow.overview.length  > 120 ? `${movieShow.overview.substring(0,120)}...` : movieShow.overview }
                        </p>
                        <div className="country">
                            <h4>Country:</h4>
                            <p>
                                {!movieShowDetails.production_countries ? "" : movieShowDetails.production_countries.map((country,index)=>
                                    <span className="country-item" key={index} style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${country.name},`}
                                    </span>)
                                }
                            </p> 
                        </div>
                        <div className="genre">
                            <h4>Genre:</h4>
                            <p>
                                {!movieShowDetails.genres ? "" : movieShowDetails.genres.map(genre=>
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
                            <p className="watchlist-icon"><FaRegHeart/></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MovieShow;