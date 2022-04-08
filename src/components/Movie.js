import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom"

const Movie = () => {
    const[videos,setVideos] = useState([]);
    const[movieDetails,setMovieDetails] = useState({});
    const { movieId } = useParams();

    useEffect(()=>{
        const getVideos = async() =>{
            const rest = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&append_to_response=videos`);
            const data = await rest.json()
            // console.log(data.results)
            const officialTrailer = data.results.filter(trailer=>trailer.type === "Trailer");
            // console.log(officialTrailer)
            setVideos(officialTrailer[0])
        };
        const getMovieDetails = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setMovieDetails(data);
        }
        getVideos();
        getMovieDetails();
    },[]);
    const baseUrl = "https://image.tmdb.org/t/p/original/";
    console.log(movieDetails)
    return(
        <div className="movie-video-container">
            <div style={{padding:"30px",height:"1200px",height:"600px"}}>
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
            </div>
            <div className="movie-items-wrapper">
                <div className="movie-item-details">
                    <div className="movie-poster">
                        <img src={`${baseUrl}/${movieDetails.poster_path}`} alt="" />
                    </div>
                    <div className="movie-item-info">
                        <h3>{movieDetails.title}</h3>
                        <div className="movie-details-header">
                            <p>HD</p>
                            <p><FaStar className="star-icon" style={{marginBottom:"3px",fontSize:"13px"}}/> <span>{movieDetails.vote_average}</span></p>
                            <p>{`${movieDetails.runtime} min`}</p>
                        </div>
                        <div className="movie-details-overview">
                            <p style={{fontSize:"16px"}}>{movieDetails.overview}</p>
                            <p  style={{fontSize:"14px"}}>
                                <span className="movie-sub-header" style={{marginRight:"50px"}}>Country:</span>
                                {!movieDetails.production_countries ? "" : 
                                    movieDetails.production_countries.map((country,index) => 
                                    <span key={index} style={{marginRight:"4px",color:"#ccc"}}>{`${country.name},`}</span>)
                                }
                            </p>
                            <p  style={{fontSize:"14px"}}>
                                <span className="movie-sub-header" style={{marginRight:"60px"}}>Genre:</span>
                                {!movieDetails.genres ? "" : movieDetails.genres.map((genres,index)=><span key={index} style={{marginRight:"4px",color:"#ccc"}}>{`${genres.name},`}</span>)}
                            </p>
                            <p  style={{fontSize:"14px"}}>
                                <span className="movie-sub-header" style={{marginRight:"50px"}}>Release:</span>
                                {movieDetails.release_date}
                            </p>
                            <p style={{fontSize:"14px"}}>
                                <span className="movie-sub-header" style={{marginRight:"50px"}}>Director:</span>
                            </p>
                            <p  style={{fontSize:"14px"}}>
                                <span className="movie-sub-header" style={{marginRight:"27px"}}>Production:</span>
                                {!movieDetails.production_companies ? "" : movieDetails.production_companies.map((company,index)=><span key={index} style={{marginRight:"4px",color:"#ccc"}}>{`${company.name},`}</span>)}
                            </p>
                            <p style={{fontSize:"14px"}}><span className="movie-sub-header" style={{marginRight:"20px"}}>Tags:</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Movie