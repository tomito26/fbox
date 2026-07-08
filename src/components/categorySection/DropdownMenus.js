import { useState } from "react";
import { FaCalendarAlt, FaCaretDown, FaCaretUp, FaClone, FaCube, FaFilter, FaFolderOpen, FaGlobeAmericas } from "react-icons/fa";
import MovieGenre from './MovieGenre';
import CategoryType from './CategoryType';
import CountriesMenu from './CountriesMenu';
import Quality from './Quality';
import SortMenu from './SortMenu';
import ReleaseYear from './ReleaseYear';
import { emptyFilters, buildDiscoverParams } from './filterOptions';

// `onFilter(type, params)` is called when the Filter button is pressed. When it
// is not provided (e.g. on pages that don't support discovery) the button is a
// no-op, matching the previous behaviour.
const DropdownMenus = ({ onFilter }) => {
    // Only one dropdown open at a time — replaces six near-identical toggles.
    const [openMenu, setOpenMenu] = useState(null);
    const toggleMenu = (name) => setOpenMenu((current) => (current === name ? null : name));

    const [filters, setFilters] = useState(emptyFilters);

    // Add/remove an id from one of the array-valued filter fields.
    const toggleValue = (field, id, checked) =>
        setFilters((prev) => ({
            ...prev,
            [field]: checked ? [...prev[field], id] : prev[field].filter((v) => v !== id),
        }));

    const handleGenreChange = (e) => {
        if (e.target.id === "includeall") {
            setFilters((prev) => ({ ...prev, includeAll: e.target.checked }));
        } else {
            toggleValue("genres", e.target.id, e.target.checked);
        }
    };
    const handleTypeChange = (e) =>
        setFilters((prev) => ({ ...prev, type: e.target.id === "series" ? "tv" : "movie" }));
    const handleCountryChange = (e) => toggleValue("countries", e.target.id, e.target.checked);
    const handleYearChange = (e) => toggleValue("years", e.target.id, e.target.checked);
    const handleSortChange = (e) => setFilters((prev) => ({ ...prev, sortBy: e.target.id }));

    const applyFilters = () => {
        setOpenMenu(null);
        if (onFilter) {
            const { type, params } = buildDiscoverParams(filters);
            onFilter(type, params);
        }
    };

    return (
        <div className="category-section">
            <div className="dropdown-category">
                <div className="category-dropdownBtn" onClick={() => toggleMenu("genre")}>
                    <FaFolderOpen style={{marginRight:"5px",marginBottom:"2px"}}/>
                    Genre All
                </div>
                {openMenu === "genre" && <MovieGenre onChange={handleGenreChange} />}
            </div>
            <div className="menu-type">
                <div className="menu-type-btn" onClick={() => toggleMenu("type")}>
                    <FaClone style={{marginRight:"5px",marginBottom:"2px"}} />
                    Type Movie
                </div>
                {openMenu === "type" && <CategoryType onChange={handleTypeChange} />}
            </div>
            <div className="country-dropdown-menu">
                <div className="country-btn" onClick={() => toggleMenu("country")}>
                    <FaGlobeAmericas style={{marginRight:"5px",marginBottom:"2px"}}/>
                    Country All
                </div>
                {openMenu === "country" && <CountriesMenu onChange={handleCountryChange} />}
            </div>
            <div className="yearDropdownMenu">
                <div className="yearDropdownBtn" onClick={() => toggleMenu("year")}>
                    <FaCalendarAlt style={{marginRight:"5px",marginBottom:"2px"}}/>
                    Year All
                </div>
                {openMenu === "year" && <ReleaseYear onChange={handleYearChange} />}
            </div>
            <div className="quality">
                <div className="qualityBtn" onClick={() => toggleMenu("quality")}>
                    <FaCube style={{marginRight:"5px",marginBottom:"2px"}} />
                    Quality All
                </div>
                {openMenu === "quality" && <Quality />}
            </div>
            <div className="sortMenu">
                <div className="sortBtn" onClick={() => toggleMenu("sort")}>
                    <span style={{marginRight:"5px"}}>
                        <FaCaretUp style={{margin:"0",padding:"0"}}/>
                        <FaCaretDown style={{margin:"0",padding:"0"}}/>
                    </span>
                    <span>Sort Default</span>
                </div>
                {openMenu === "sort" && <SortMenu onChange={handleSortChange} />}
            </div>
            <button className="filterBtn" onClick={applyFilters}><FaFilter style={{marginRight:"5px"}}/>Filter</button>
        </div>
    );
}
export default DropdownMenus;
