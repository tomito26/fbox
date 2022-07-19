const MovieGenre = () =>{
    return(
        <div className="menu-items">
            <div className="div">
                <div className="form-check">
                    <input type="checkbox" name="action" id="action" />
                    <label htmlFor="action">Action</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="costume" id="costume" />
                    <label htmlFor="costume">Costume</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="drama" id="drama" />
                    <label htmlFor="drama">Drama</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="history" id="history" />
                    <label htmlFor="history">History</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="mystery" id="mystery" />
                    <label htmlFor="mystery">Mystery</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="sport" id="sport" />
                    <label htmlFor="sport">Sport</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="western" id="western" />
                    <label htmlFor="western">Western</label>
                </div>
            </div>
            <div className="div">
                <div className="form-check">
                    <input type="checkbox" name="adventure" id="adventure" />
                    <label htmlFor="adventure">Adventure</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="comedy" id="comedy" />
                    <label htmlFor="comedy">Comedy</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="family" id="family" />
                    <label htmlFor="family">Family</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="horror" id="horror" />
                    <label htmlFor="horror">Horror</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="reality-tv" id="reality-tv" />
                    <label htmlFor="reality-tv">Reality Tv</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="thriller" id="thriller" />
                    <label htmlFor="thriller">Thriller</label>
                </div>
                <div className="form-check includeall">
                    <input type="checkbox" name="includeall" id="includeall" />
                    <label htmlFor="includeall">Include all selected</label>
                </div>
            </div>
            <div className="div">
                <div className="form-check">
                    <input type="checkbox" name="animation" id="animation" />
                    <label htmlFor="animation">Animation</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="crime" id="crime" />
                    <label htmlFor="crime">
                        Crime
                    </label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="fantasy" id="fantasy" />
                    <label htmlFor="fantasy">Fantasy</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="kungfu" id="kungfu" />
                    <label htmlFor="kungfu">Kungfu</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="romance" id="romance" />
                    <label htmlFor="romance">Romance</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="tvshows" id="tvshow" />
                    <label htmlFor="tvshow">Tv Show</label>
                </div>
            </div>
            <div className="div">
                <div className="form-check">
                    <input type="checkbox" name="biography" id="biography" />
                    <label htmlFor="biography">Biography</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="documentary" id="documentary" />
                    <label htmlFor="documentary">Documentary</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="gameshow" id="gameshow" />
                    <label htmlFor="gameshow">Game-Show</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="music" id="music" />
                    <label htmlFor="music">Music</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="sci-fi" id="sci-fi" />
                    <label htmlFor="sci-fi">SCi-Fi</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="war" id="war" />
                    <label htmlFor="war">war</label>
                </div>
            </div>        
        </div> 
    );
};

export default MovieGenre;