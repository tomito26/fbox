const SortMenu = () =>{
    return(
        <div className="sort-items">
            <div className="form-check">
                <input type="radio" name="sort" id="default" />
                <label htmlFor="default">Default</label>
            </div>
            <div className="form-check">
                <input type="radio" name="sort" id="recently-added" />
                <label htmlFor="recently-added">Recently Added</label>
            </div>
            <div className="form-check">
                <input type="radio" name="sort" id="most-watched" />
                <label htmlFor="most-watched">Most Watched</label>
            </div>
            <div className="form-check">
                <input type="radio" name="sort" id="name" />
                <label htmlFor="name">Name</label>
            </div>
            <div className="form-check">
                <input type="radio" name="sort" id="imdb" />
                <label htmlFor="imdb">IMDb</label></div>
            <div className="form-check">
                <input type="radio" name="sort" id="release-date" />
                <label htmlFor="release-date">Release Date</label>
            </div>
            <div className="form-check">
                <input type="radio" name="sort" id="site-rating" />
                <label htmlFor="site-rating">Site Rating</label>
            </div>
        </div>
    );
}
export default SortMenu;