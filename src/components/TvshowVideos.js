import { async } from "@firebase/util";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

const TvShowVideos = () =>{
    const [video,setVideo] = useState({});
    const[tvShowDetails,setTvShowDetails] = useState({});
    const[casts,setCasts] = useState([])
    const[directors,setDirectors]= useState([]);
    const { tvshowId } = useParams();

    useEffect(()=>{
        const getTvShowVideos = async()=>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&append_to_response=videos`);
            const data = await rest.json();
            // console.log(data)
            const trailer = data.results.filter(video => video.type === "Trailer" || video.name === "Official Trailer");
            // console.log(trailer)
            setVideo(trailer);
            
        }

        const getTvShowDetails = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setTvShowDetails(data)
        }
        const getCredits = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setCasts(data.cast);
            const crew = data.crew.filter(crew => crew.known_for_department === "Directing")
            setDirectors(crew) 
        
        }
        getCredits()
        getTvShowVideos();
        getTvShowDetails();
    },[]);
    const baseUrl = "https://image.tmdb.org/t/p/original/";

    // console.log(video)
    return(
        <div className="movie-video-container">
            <div className="video-wrapper" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${baseUrl}/${!tvShowDetails ? "" :tvShowDetails.backdrop_path})`,height:"680px",width:"100%", backgroundPosition:"center",backgroundSize:"cover",margin:"40px 0"}}>
                <div style={{padding:"0 10px 0 40px",width:"1400px",height:"680px"}}>
                    <iframe 
                        style={{padding:"0",margin:"0",backgroundColor:"#000"}}
                        width="1200" 
                        height="680"
                        src={video ? `https://www.youtube.com/embed/${!video[0] ? "" : video[0].key}` : ""} 
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
            </div>
            <div className="movie-items-wrapper">
                <div className="movie-item-details">
                    <div className="movie-poster">
                        <img src={`${baseUrl}/${tvShowDetails.poster_path}`} alt={tvShowDetails.name} />
                    </div>
                    <div className="movie-item-info">
                        <h3>{tvShowDetails.name}</h3>
                        <div className="movie-details-header">
                            <p>HD</p>
                            <p><FaStar className="star-icon" style={{marginBottom:"3px",fontSize:"13px"}}/> <span>{tvShowDetails.vote_average}</span></p>
                            <p>{`na min`}</p>
                        </div>
                        <div className="movie-details-overview">
                            <p style={{fontSize:"16px"}}>
                                {
                                    !tvShowDetails.overview ? "" : 
                                    tvShowDetails.overview.length > 200 ? 
                                    `${tvShowDetails.overview.substring(0,180)}...${<button>hello</button>}`
                                    : tvShowDetails.overview 
                                }
                            </p>
                            <div className="movie-category" style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"53px"}}>Country:</h4>
                                <p>
                                    {!tvShowDetails.production_countries ? "" : 
                                        tvShowDetails.production_countries.map((country,index) => 
                                        <span key={index} style={{marginRight:"4px",color:"#ccc"}}>
                                            {`${country.name},`}
                                        </span>)
                                    }
                                </p>
                            </div>
                            <div className="movie-category"  style={{fontSize:"14px"}}>
                                <h4 className="movie-sub-header" style={{marginRight:"68px"}}>Genre:</h4>
                                <p>
                                    {!tvShowDetails.genres ? "" : tvShowDetails.genres.map((genres,index)=>
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
                                <p>{tvShowDetails.first_air_date}</p>
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
                                    {!tvShowDetails.production_companies ? "" : tvShowDetails.production_companies.map((company,index)=>
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
            </div>    
        </div>
    );
};

export default TvShowVideos;