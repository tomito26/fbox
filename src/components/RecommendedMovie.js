const RecommendedMovie = ({ movie }) =>{
    console.log(movie)
    const baseUrl = "https://image.tmdb.org/t/p/original/"
    const releaseYear = movie.release_date.split("-");
    const year = releaseYear[0];
    console.log(year)
    return(
        <div className="movie-card">
            <div className="movie-img">
                <img src={`${baseUrl}/${movie.poster_path}`} alt={movie.overview}/>
            </div>
            <div className="movie-info">
                <p>{movie.title}</p>
                <p><span>{year}</span> <span className="movie-tag">movie</span></p>
            </div>
            

        </div>
    );
};
export default RecommendedMovie;