import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import './Filters.css'

const Filters = () =>{

    return (
        <div style={{padding: '20px'}}>
            <button >All</button>
            <button >Recent</button>
            <button >Celebration</button>
            <button >Thank You</button>
            <button >Inspiration</button>
        </div>
    )
}

export default Filters;