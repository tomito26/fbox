import { useState } from "react";
import { FaCalendarAlt, FaCaretDown, FaCaretUp, FaClone, FaCube, FaFilter, FaFolderOpen, FaGlobeAmericas } from "react-icons/fa";
import MovieGenre from './MovieGenre';
import CategoryType from './CategoryType';
import CountriesMenu from './CountriesMenu';
import Quality from './Quality';
import SortMenu from './SortMenu'
import ReleaseYear from './ReleaseYear'
const DropdownMenus = () => {
    const [categoryIsActive,setCategoryIsActive] = useState(false);
    const[typeIsActive,setTypeIsActive] = useState(false);
    const[countryIsActive,setCountryIsActive] = useState(false);
    const[yearMenuIsActive,setYearMenuIsActive] = useState(false);
    const[qualityMenuIsActive,setQualityMenuIsActive] = useState(false);
    const[sortMenuIsActive,setSortMenuIsActive] = useState(false);

    const categoryToggleBtn = () => {
        setTypeIsActive(false);
        setCountryIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false)
        setSortMenuIsActive(false)
        return categoryIsActive ? setCategoryIsActive(false) : setCategoryIsActive(true);
    }
    const typeDropdownMenuBtn = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false)
        setSortMenuIsActive(false)
        return typeIsActive ? setTypeIsActive(false) : setTypeIsActive(true);
    }
    const countriesDropdownMenu = () =>{
        setCategoryIsActive(false);
        setTypeIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false);
        setSortMenuIsActive(false)
        return countryIsActive ? setCountryIsActive(false) : setCountryIsActive(true);
    }
    const yearDropdownMenu = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setTypeIsActive(false);
        setQualityMenuIsActive(false)
        setSortMenuIsActive(false)
        return yearMenuIsActive ? setYearMenuIsActive(false) : setYearMenuIsActive(true);
    }
    const qualityDropdownMenu = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setTypeIsActive(false);
        setYearMenuIsActive(false);
        setSortMenuIsActive(false)
        return qualityMenuIsActive ? setQualityMenuIsActive(false) : setQualityMenuIsActive(true);
    }

    const sortDropdownMenu = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setTypeIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false);
        return sortMenuIsActive ? setSortMenuIsActive(false) :setSortMenuIsActive(true);  
    }
    return(
        
        <div className="category-section">
            <div className="dropdown-category">
                <div className="category-dropdownBtn" onClick={categoryToggleBtn}>
                    <FaFolderOpen style={{marginRight:"5px",marginBottom:"2px"}}/>
                    Genre All
                </div>
                {categoryIsActive && <MovieGenre/>}               
            </div>
            <div className="menu-type">
                <div className="menu-type-btn" onClick={typeDropdownMenuBtn}>
                    <FaClone style={{marginRight:"5px",marginBottom:"2px"}} />
                    Type Movie
                </div>
                { typeIsActive && <CategoryType/> }
            </div>
            <div className="country-dropdown-menu">
                <div className="country-btn" onClick={countriesDropdownMenu}>
                    <FaGlobeAmericas style={{marginRight:"5px",marginBottom:"2px"}}/>
                    Country All
                </div>
                { countryIsActive && <CountriesMenu/>  }                      
            </div>
            <div className="yearDropdownMenu">
                <div className="yearDropdownBtn" onClick={yearDropdownMenu}>
                    <FaCalendarAlt style={{marginRight:"5px",marginBottom:"2px"}}/>
                    Year All
                </div>
                { yearMenuIsActive && <ReleaseYear/> }
            </div>
            <div className="quality">
                <div className="qualityBtn" onClick={qualityDropdownMenu}>
                    <FaCube style={{marginRight:"5px",marginBottom:"2px"}} />
                    Quality All
                </div>
                { qualityMenuIsActive &&  <Quality/>}
            </div>
            <div className="sortMenu">
                <div className="sortBtn" onClick={sortDropdownMenu}>
                    <span style={{marginRight:"5px"}}>
                        <FaCaretUp style={{margin:"0",padding:"0"}}/>
                        <FaCaretDown style={{margin:"0",padding:"0"}}/>
                    </span>
                    <span>Sort Default</span>
                </div>
                { sortMenuIsActive && <SortMenu/>   }
            </div>
            <button className="filterBtn"><FaFilter style={{marginRight:"5px"}}/>Filter</button>
        </div>
    );
}
export default DropdownMenus;