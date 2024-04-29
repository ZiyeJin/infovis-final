function Tooltip(props) {
    const {d, x, y} = props;
    console.log(d);
    if (x === null|!d) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "150px",
            height: "180px",
            padding: "2px",
            font: "12px sans-serif",
            background: "lightgreen",
            border: "0px",
            borderRadius: "8px",
            pointerEvents: "none",
            left: `${x+10}px`,
            top: `${y}px`
        };
        return (<div style={divStyle} >
            <p>{d.Index}</p>
            <p>Trading Info:</p>
            <ul> 
            <li>Location: {d.Location}</li>
            <li>Open: {d.Open.toFixed(2)}</li>
            <li>High: {d.High.toFixed(2)}</li>
            <li>Low: {d.Low.toFixed(2)}</li>
            <li>Close: {d.Close.toFixed(2)}</li>
            <li>Return%: {d.Return.toFixed(2)}</li>
            </ul>
            </div>)
    };  
}

export { Tooltip };