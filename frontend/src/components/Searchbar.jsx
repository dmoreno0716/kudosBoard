import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const Searchbar = () => {

  return(
    <div>
    <form id="search">
            <input
              id="search-input"
              type="text"
              style={{width: '400px', height: '40px'}}
              placeholder="Search boards..."
            />
          </form>
    </div>
  )

}

export default Searchbar;



// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom/client";
// import './MovieCard.css'

// const MovieCard = (props) => {
//   const poster = `https://image.tmdb.org/t/p/w500${props.poster}`
 
//   return (
    
//       <div className="Poster">
//         <div>
//         <img src={poster}></img>
//         </div>
//       </div>

      
//   )
// };

// export default MovieCard;
