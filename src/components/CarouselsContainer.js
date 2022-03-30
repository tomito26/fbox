import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { FaHeart, FaPlay, FaRegHeart, FaStar } from 'react-icons/fa'

const CarouselContainer = () =>{
    const[carouselMovies,setCarouselMovies] = useState([]);
    useEffect(()=>{
        getTrendingMovies();

    },[]);

    const getTrendingMovies = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_MOVIE_API_KEY}`)
        const data = await rest.json();
        setCarouselMovies(data.results.slice(0,11));
    };
    console.log(carouselMovies)

    const baseUrl = "https://image.tmdb.org/t/p/original/"
    
    return(
        <Carousel className='carousel-wrapper' controls={false}>
            <Carousel.Item interval={3000} className="wrapper" >
                <img
                fluid={true}
                className="d-block w-100 img-fluid"
                src={`${baseUrl}/${carouselMovies[0]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3 className=''>{carouselMovies[0] === undefined ? "" : carouselMovies[0].title || carouselMovies[0].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[0] === undefined ? "" : carouselMovies[0].vote_average}</span></p>
                        <p>{carouselMovies[0] === undefined ? "" : carouselMovies[0].media_type}</p>
                    </div>
                    <p>{carouselMovies[0] === undefined ? "" : carouselMovies[0].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                fluid={true}
                className="d-block w-100 img-fluid"
                src={`${baseUrl}/${carouselMovies[1]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[1] === undefined ? "" : carouselMovies[1].title}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[1] === undefined ? "" : carouselMovies[1].vote_average}</span></p>
                        <p>{carouselMovies[1] === undefined ? "" : carouselMovies[1].media_type}</p>
                    </div>
                    <p>{carouselMovies[1] === undefined ? "" : carouselMovies[1].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[2]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[2] === undefined ? "" : carouselMovies[2].title || carouselMovies[2].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[2] === undefined ? "" : carouselMovies[2].vote_average}</span></p>
                        <p>{carouselMovies[2] === undefined ? "" : carouselMovies[2].media_type}</p>
                    </div>
                    <p>{carouselMovies[2] === undefined ? "" : carouselMovies[2].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[3]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[3] === undefined ? "" : carouselMovies[3].title || carouselMovies[0].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[3] === undefined ? "" : carouselMovies[3].vote_average}</span></p>
                        <p>{carouselMovies[3] === undefined ? "" : carouselMovies[3].media_type}</p>
                    </div>
                    <p>{carouselMovies[3] === undefined ? "" : carouselMovies[3].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[4]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[4] === undefined ? "" : carouselMovies[4].title || carouselMovies[4].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[4] === undefined ? "" : carouselMovies[4].vote_average}</span></p>
                        <p>{carouselMovies[4] === undefined ? "" : carouselMovies[4].media_type}</p>
                    </div>
                    <p>{carouselMovies[4] === undefined ? "" : carouselMovies[4].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[5]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[5] === undefined ? "" : carouselMovies[5].title || carouselMovies[5].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[5] === undefined ? "" : carouselMovies[5].vote_average}</span></p>
                        <p>{carouselMovies[5] === undefined ? "" : carouselMovies[5].media_type}</p>
                    </div>
                    <p>{carouselMovies[5] === undefined ? "" : carouselMovies[5].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[6]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[6] === undefined ? "" : carouselMovies[6].title || carouselMovies[6].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[6] === undefined ? "" : carouselMovies[6].vote_average}</span></p>
                        <p>{carouselMovies[6] === undefined ? "" : carouselMovies[6].media_type}</p>
                    </div>
                    <p>{carouselMovies[6] === undefined ? "" : carouselMovies[6].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[7]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[7] === undefined ? "" : carouselMovies[7].title || carouselMovies[7].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar/></span><span className='voting-average' >{carouselMovies[7] === undefined ? "" : carouselMovies[7].vote_average}</span></p>
                        <p>{carouselMovies[7] === undefined ? "" : carouselMovies[7].media_type}</p>
                    </div>
                    <p>{carouselMovies[7] === undefined ? "" : carouselMovies[7].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[8]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>{carouselMovies[8] === undefined ? "" : carouselMovies[8].title || carouselMovies[8].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className="rating"><span className='star'><FaStar/></span><span className='voting-average'>{carouselMovies[8] === undefined ? "" : carouselMovies[8].vote_average}</span></p>
                        <p>{carouselMovies[8] === undefined ? "" : carouselMovies[8].media_type}</p>
                    </div>
                    <p>{carouselMovies[8] === undefined ? "" : carouselMovies[8].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item interval={3000} className="wrapper" >
                <img
                className="d-block w-100"
                src={`${baseUrl}/${carouselMovies[9]?.backdrop_path}`}
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3 className='text-shadow'>{carouselMovies[9] === undefined ? "" : carouselMovies[9].title || carouselMovies[9].name}</h3>
                    <div className="movie-details">
                        <p>HD</p>
                        <p className='rating'><span className='star'><FaStar /></span><span className='voting-average'>{carouselMovies[9] === undefined ? "" : carouselMovies[9].vote_average}</span></p>
                        <p>{carouselMovies[9] === undefined ? "" : carouselMovies[9].media_type}</p>
                    </div>
                    <p>{carouselMovies[9] === undefined ? "" : carouselMovies[9].overview}</p>
                    <div className="watch">
                        <button className="play"><FaPlay className='play-icon'/>Watch now</button>
                        <button className="add-watchlist"><FaRegHeart className='heart'/>Add to list</button>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};
export default CarouselContainer;