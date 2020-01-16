import React from "react";
import classes from './Card.css'

export default function Card({number, isFlipped, onClick}) {
	return(
        <div className={classes.CardElement} onClick={onClick}>
            <div className={isFlipped ? classes.flipped : ""}>
                {number}
            </div>
        </div>
    ) 
}