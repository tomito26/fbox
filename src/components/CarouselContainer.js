import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

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


    return(
        <Carousel className='carousel-wrapper' controls={false}>
            <Carousel.Item interval={2000} className="wrapper" >
                <img
                className="d-block w-100"
                src="https://www.pexels.com/photo/745708/download/?search_query=&tracking_id=qyyk3uwqgj9"
                alt="First slide"
                />
                <Carousel.Caption className='ca-caption'>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} className='wrapper' >
                <img
                className="d-block w-100"
                src="https://www.pexels.com/photo/518973/download/"
                alt="Second slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={2000} className='wrapper' >
                <img
                className="d-block w-100"
                src="https://www.pexels.com/photo/1453060/download/"
                alt="Third slide"
                />
                <Carousel.Caption className='ca-caption'>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};
export default CarouselContainer;