import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";

const SimilarMovies = ({ similarMovie }) =>{
    const [similarMovieDetail,setSimilarMovieDetail] = useState({});
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
        <div className="similar-movie-container">
            <div className="similar-movie-poster">
                <img src={`${baseUrl}/${similarMovie.poster_path}`} alt={similarMovie.title} />
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
        </div>
    );
};

export default SimilarMovies;