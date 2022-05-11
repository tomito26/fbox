import { NavLink } from "react-router-dom";
const SeasonMenu =  ({ season,index,setIsClicked,setSelectedSeason,tvshowId }) => {

    const seasonReleaseDate = new Date(season.air_date);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = months[seasonReleaseDate.getMonth()];
    const date = seasonReleaseDate.getDate();
    const year = seasonReleaseDate.getFullYear();
    console.log(season)
    const seasonNumber = index +1 
    

    return(
        <NavLink  
            to={index === 0 ? `/tvshows/${tvshowId}/` : `/tvshows/${tvshowId}/${seasonNumber}`} 
            onClick={()=> {setIsClicked(false); setSelectedSeason({seasonNumber:index+1,monthReleased:month,dateReleased:date,yearReleased:year})}}
            className="season-link"
            style={({isActive})=>{return{backgroundColor: isActive ? "#FFC300" : "transparent"}}}
        >
            <span>{`Season ${index + 1} `}</span>
            -
            <span>{`${month} ${date}, ${year}`}</span>
        </NavLink>
    )
}
export default SeasonMenu;