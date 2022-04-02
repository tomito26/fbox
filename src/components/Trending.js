const Trending = ({ trending })=>{
    
    const baseUrl = "https://image.tmdb.org/t/p/original/"
    const seriesReleaseDate =trending.first_air_date;
    const movieReleaseDate = !trending.release_date ? seriesReleaseDate.split("-")[0] : trending.release_date.split("-")[0];

    return(
        <div className="movie-card">
            <div className="movie-img">
                <img src={`${baseUrl}/${trending.poster_path}`} alt={trending.name} />
            </div>
            <div className="movie-info">
                <p className="movie-title">
                    {!trending.title ? trending.name.length > 25 ? `${trending.name.substring(0,23)}...`:trending.name 
                        :
                        trending.title.length > 20 ? `${trending.title.substring(0,21)}...`:trending.title }
                </p>
                <p className="movie-footer">
                    <span className="year">{movieReleaseDate}</span>
                    <span className="movie-tag">{trending.media_type}</span>
                </p>
            </div>

        </div>
    );
};

export default Trending;