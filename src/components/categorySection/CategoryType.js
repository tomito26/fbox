const CategoryType = () =>{
    return(
        <div className="menu-type-items">
            <div className="form-check">
                <input type="checkbox" name="movie" id="movie"/>
                <label htmlFor="movie">Movie</label>
            </div>
            <div className="form-check">
                <input type="checkbox" name="series" id="series"/>
                <label htmlFor="series">Series</label>
            </div>

        </div>
    );
}

export default CategoryType;