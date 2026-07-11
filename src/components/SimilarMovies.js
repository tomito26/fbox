import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import { getMovie, imageUrl } from "../services/tmdb";

const SimilarMovies = ({ similarMovie }) =>{
    const [similarMovieDetail,setSimilarMovieDetail] = useState({});
    useEffect(()=>{
        const abortCont = new AbortController();
        getMovie(similarMovie.id, abortCont.signal).then(({ data }) => {
            if (data) setSimilarMovieDetail(data);
        });

        return () => abortCont.abort();
    },[similarMovie.id])
    const releaseDate = similarMovie.release_date || "";
    const year = releaseDate.split("-");
   
    return(
        <div className="similar-movie-container">
            <Link className="similar-movie-link" to={`/movie/${similarMovie.id}`}>
                <div className="similar-movie-poster">
                    <img
                        src={imageUrl(similarMovie.poster_path, "w342")}
                        alt={similarMovie.title}
                        loading="lazy"
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
        </div>
    );
};

export default SimilarMovies;