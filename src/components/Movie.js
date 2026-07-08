import { useEffect, useState } from "react";
import { FaExclamationCircle, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom"
import SimilarMovies from "./SimilarMovies";
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const Movie = () => {
    const[videos,setVideos] = useState([]);
    const[movieDetails,setMovieDetails] = useState({});
    const[casts,setCasts] = useState([]);
    const[directors,setDirectors] = useState([]);
    const[similarMovies,setSimilarMovies] = useState([]);
    const[error,setError] = useState(null);
    const { movieId } = useParams();

    useEffect(()=>{
        const getVideos = async() =>{
            try {
                const data = await tmdbFetch(`/movie/${movieId}/videos`, { append_to_response: "videos" });
                const officialTrailer = data.results.filter(trailer=>trailer.type === "Trailer"  || trailer.site === "YouTube");
                setVideos(officialTrailer[officialTrailer.length - 1])
            } catch (err) {
                setError("Couldn't load this movie. Please try again later.");
            }
        };

        const getMovieDetails = async () =>{
            try {
                const data = await tmdbFetch(`/movie/${movieId}`, { language: "en-US" });
                setMovieDetails(data);
            } catch (err) {
                setError("Couldn't load this movie. Please try again later.");
            }
        };

        const getCredits = async () =>{
            try {
                const data = await tmdbFetch(`/movie/${movieId}/credits`, { language: "en-US" });
                setCasts(data.cast);

                const crewDirecting = data.crew.filter(directors => directors.known_for_department === "Directing");
                setDirectors(crewDirecting)
            } catch (err) {
                setError("Couldn't load this movie. Please try again later.");
            }
        };
        const getSimilarMovies = async () => {
            try {
                const data = await tmdbFetch(`/movie/${movieId}/similar`, { language: "en-US", page: 1 });
                setSimilarMovies(data.results.slice(0,9))
            } catch (err) {
                setError("Couldn't load this movie. Please try again later.");
            }
        }

        getCredits();
        getVideos();
        getMovieDetails();
        getSimilarMovies();
    },[movieId]);

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    

    return(
        <div className="movie-video-container">
            {error && <ErrorMessage message={error}/>}
            <div className="video-wrapper" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${baseUrl}/${movieDetails.backdrop_path})`,height:"600px",width:"100%", backgroundPosition:"center",backgroundSize:"cover",margin:"40px 0"}}>
                <div style={{padding:"0 10px 0 40px",width:"1400px",height:"600px",position:"relative"}}>
                    <iframe 
                        style={{padding:"0",margin:"0",backgroundColor:"#000"}}
                        width="1200" 
                        height="600"
                        src={videos ? `https://www.youtube.com/embed/${videos.key}` : ""} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; 
                        autoplay; 
                        clipboard-write; 
                        encrypted-media; 
                        gyroscope; 
                        picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                    {!videos &&
                    <div className="error-message">
                        <FaExclamationCircle style={{marginRight:"5px",marginBottom:"3px",fontSize:"30px"}}/>This video is unavailable
                    </div>}
                </div>
            </div>
            <div className="movie-items-wrapper">
                <div className="movie-item-details">
                    <div className="movie-poster">
                        <img src={`${baseUrl}/${movieDetails.poster_path}`} alt={movieDetails.name} />
                    </div>
                    <div className="movie-item-info">
                        <h3>{movieDetails.title}</h3>
                        <div className="movie-details-header">
                            <p>HD</p>
                            <p><FaStar className="star-icon" style={{marginBottom:"3px",fontSize:"13px"}}/> <span>{movieDetails.vote_average}</span></p>
                            <p>{`${movieDetails.runtime} min`}</p>
                        </div>
                        <div className="movie-details-overview">
                            <p style={{fontSize:"16px"}}>
                                {!movieDetails.overview ? "" : movieDetails.overview.length > 200 ? `${movieDetails.overview.substring(0,180)}...` : movieDetails.overview }
                                
                            </p>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"53px"}}>Country:</h4>
                                <p>
                                    {!movieDetails.production_countries ? "" : 
                                        movieDetails.production_countries.map((country,index) => 
                                        <span key={index} style={{marginRight:"4px",color:"#ccc"}}>
                                            {`${country.name},`}
                                        </span>)
                                    }
                                </p>
                            </div>
                            <div className="movie-category"  style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"68px"}}>Genre:</h4>
                                <p>
                                    {!movieDetails.genres ? "" : movieDetails.genres.map((genres,index)=>
                                        <span key={index} style={{marginRight:"4px",color:"#ccc"}}>
                                            {`${genres.name},`}
                                        </span>)
                                    }
                                </p>
                            </div>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"57px"}}>
                                    Release:
                                </h4>
                                <p>{movieDetails.release_date}</p>
                            </div>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"54px"}}>
                                    Director:
                                </h4>
                                <p>
                                    {directors.map((director,index)=>
                                        <span key={index} style={{marginRight:"4px"}}>
                                            {`${director.name},`}
                                        </span>)
                                    }
                                </p>
                            </div>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"36px"}}>
                                    Production:
                                </h4>
                                <p>
                                    {!movieDetails.production_companies ? "" : movieDetails.production_companies.map((company,index)=>
                                        <span key={index} style={{marginRight:"4px",color:"#ccc"}}>
                                            {`${company.name},`}
                                        </span>)
                                    }
                                </p>
                            </div>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"80px"}}>
                                    Cast:
                                </h4>
                                <p>
                                    {!casts ? "" : casts.length > 10 ? casts.slice(0,10).map((cast,index)=>
                                        <span key={index} style={{marginRight:"4px",color:"#ccc"}}>
                                            {`${cast.name},`}
                                        </span>) : 
                                        casts.map((cast,index)=>
                                        <span key={index} style={{marginRight:"4px",color:"#ccc"}}>
                                            {`${cast.name},`}
                                        </span>)
                                    }
                                </p>
                            </div>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"20px"}}>
                                    Tags:
                                </h4>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="similar-movies-wrapper">
                    <h3><span>You may also like</span></h3>
                    <div className="similar-movies">
                        {similarMovies.map(similarMovie => 
                            <SimilarMovies 
                                key={similarMovie.id}
                                similarMovie={similarMovie}
                            />)
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Movie