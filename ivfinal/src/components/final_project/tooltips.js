import React, { useState } from "react";

function Tooltip(props) {
    const { alldata, x, y, selectedDate, selectedIndex} = props;
    const [showTooltip, setShowTooltip] = useState(true);

    if (!alldata || selectedIndex === null || !showTooltip) {
        return null;
    }
    console.log(selectedIndex)
   
    const data = alldata.filter((d) => {
        return (
            d.Date.getFullYear() === selectedDate.getFullYear() &&
            d.Date.getMonth() === selectedDate.getMonth() &&
            d.Date.getDate() === selectedDate.getDate() &&
            d.Index === selectedIndex
        );
    });

    const dat = data[0];
    console.log(dat)
    
    if (data.length === 0) {
        return null;
    }


    const divStyle = {
        position: "absolute",
        textAlign: "left",
        width: "150px",
        height: "190px",
        padding: "10px",
        font: "12px sans-serif",
        background: "#9024ED",
        color: "white",
        border: "1px solid #874CCC",
        borderRadius: "8px",
        pointerEvents: "none",
        left: `${x + 10}px`,
        top: `${y}px`,
    };

    return (
        <div style={divStyle}>
            <p>{dat.Index}</p>
            <p>Trading Info:</p>
            <ul>
                <li>Location: {dat.Location}</li>
                <li>Open: {dat.Open.toFixed(2)}</li>
                <li>High: {dat.High.toFixed(2)}</li>
                <li>Low: {dat.Low.toFixed(2)}</li>
                <li>Close: {dat.Close.toFixed(2)}</li>
                <li>Return%: {dat.Return.toFixed(2)}</li>
            </ul>
        </div>
    );
}

export { Tooltip };
