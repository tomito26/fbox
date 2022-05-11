import { useEffect, useState } from "react";
import { FaListUl, FaStar,FaExclamationCircle } from "react-icons/fa";
import { Outlet, useParams } from "react-router-dom";
import SeasonMenu from "./SeasonMenu";
import SimilarTvShow from "./SimilarTvShow";

const TvShowVideos = () =>{
    const [video,setVideo] = useState({});
    const[tvShowDetails,setTvShowDetails] = useState({});
    const[casts,setCasts] = useState([]);
    const[isClicked,setIsClicked] = useState(false);
    const[directors,setDirectors]= useState([]);
    const[similarTvShows,setSimilarTvShows]=useState([]);
    const { tvshowId } = useParams();
    const[selectedSeason,setSelectedSeason] = useState({
        seasonNumber:"",
        monthReleased:"",
        dateReleased:"",
        yearReleased:"",
    });

    useEffect(()=>{
        const getTvShowVideos = async()=>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&append_to_response=videos`);
            const data = await rest.json();
            console.log(data)
            const trailer = data.results.filter(video => video.type === "Trailer" || video.name === "Official Trailer" || video.site === "YouTube");
            console.log(trailer)
            setVideo(trailer[trailer.length - 1]);
            
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
        const getSimilarTvShows = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}/similar?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
            const data = await rest.json();

            setSimilarTvShows(data.results.slice(0,9));
        }   
        
        getTvShowVideos();
        getTvShowDetails();
        getCredits()
        getSimilarTvShows()
    },[]);
    const baseUrl = "https://image.tmdb.org/t/p/original/";
    // console.log(tvShowDetails)
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const air_date = new Date(!tvShowDetails.seasons ? ""  : tvShowDetails.seasons[0].air_date)
    const month = months[air_date.getMonth()];
    const date = air_date.getDate()
    const year = air_date.getFullYear()
    // console.log(year)

    return(
        <div className="movie-video-container">
            <div className="video-wrapper" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${baseUrl}/${!tvShowDetails ? "" :tvShowDetails.backdrop_path})`,height:"600px",width:"100%", backgroundPosition:"center",backgroundSize:"cover",margin:"40px 0"}}>
                <div style={{padding:"0 10px 0 40px",width:"1400px",height:"600px",position:"relative"}}>
                    <iframe 
                        style={{padding:"0",margin:"0",backgroundColor:"#000"}}
                        width="1200" 
                        height="600"
                        src={video ? `https://www.youtube.com/embed/${!video ? "" : video.key}` : ""} 
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
                    {!video &&
                    <div className="error-message">
                        <FaExclamationCircle style={{marginRight:"5px",marginBottom:"3px",fontSize:"30px"}}/>This video is unavailable
                    </div>}
                </div>
            </div>
            <div className="video-links">
                <div className="season-menu">
                   <p onClick={()=>setIsClicked(true)} className={isClicked ? "isActive" : ""}>
                        <FaListUl className="burger"/> 
                        <span className="season-item">
                            {selectedSeason.seasonNumber === "" ? "Season 1" :`Season ${selectedSeason.seasonNumber}`}  -
                        </span>
                        <span className="season-date">
                            {selectedSeason.monthReleased === "" && selectedSeason.dateReleased === "" && selectedSeason.yearReleased === "" ? `${month} ${date},${year}` : `${selectedSeason.monthReleased} ${selectedSeason.dateReleased},${selectedSeason.yearReleased}`}
                        </span>
                    </p>
                   {isClicked && <div className="seasonDropdownMenu">
                       {!tvShowDetails.seasons ? "" : tvShowDetails.seasons.map((season,index ) =><SeasonMenu key={season.id} index={index} season={season} setIsClicked={setIsClicked} setSelectedSeason={setSelectedSeason} tvshowId={tvshowId}/> )}
                   </div>}
                </div> 
                <Outlet/>
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
                <div className="similar-movies-wrapper">
                    <h3><span>You may also like</span></h3>
                    <div className="similar-movies">
                        {similarTvShows.map(similarTvShow => 
                            <SimilarTvShow 
                                key={similarTvShow.id}
                                similarTvShow={similarTvShow}
                            />)
                        }
                    </div>
                </div>
            </div>    
        </div>
    );
};

export default TvShowVideos;