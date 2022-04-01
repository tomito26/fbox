const TvShow  = ({ tvShow }) =>{
    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const releaseYear = tvShow.first_air_date.split("-");
    const year = releaseYear[0];
    return(
        <div className="movie-card">
            <div className="movie-img">
                <img src={`${baseUrl}/${tvShow.poster_path}`} alt={tvShow.name} />
            </div>
            <div className="movie-info">
                <p className="movie-title">{tvShow.name > 23 ? `${tvShow.name.slice(0,22)}...` : tvShow.name}</p>
                <p className="movie-footer "><span className="year">{year}</span><span className="movie-tag series-tag">Tv</span></p>
            </div>

        </div>
    );
}

export default TvShow;