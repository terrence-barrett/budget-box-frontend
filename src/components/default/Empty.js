import React from "react";

const Empty = (props) => {
    return (
        <div className={`nouser-container ${props.className ? props.className : '' }`}>
            <img width="72" src={props.icon} alt="icon" />
            <p>{props.message ?? 'Empty'}</p>
        </div>
    );
}

export default Empty;