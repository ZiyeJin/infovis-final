import React , { useState }from "react";
import { max, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";


export function BarChart (props) {
    const {offsetX, offsetY, data, height, width, selectedAirline, setSelectedAirline} = props;
    let maximunCount = max(data, d => d.Count);
    const xScale = scaleLinear().range([0, width]).domain([0, maximunCount]).nice();
    const yScale = scaleBand().range([0, height]).domain(data.map(a => a.AirlineName)).padding(0.2) //The domain is the list of ailines names
    let color = (d) => d.AirlineID===selectedAirline? "#b09a0c":"#5a1e8a";
   
    const [selectedBar, setSelectedBar] = useState(null);
    const onClick = (d) => {
        if (selectedBar === d.AirlineID) {
            setSelectedAirline(null);
            setSelectedBar(null);
        } else {
            setSelectedAirline(d.AirlineID);
            setSelectedBar(d.AirlineID);
        }
    };

    return <g transform={`translate(${offsetX}, ${offsetY})`}>
        {data.map(d => (
                <rect
                    key={d.AirlineID}
                    x={0}
                    y={yScale(d.AirlineName)}
                    width={xScale(d.Count)}
                    height={yScale.bandwidth()}
                    onClick={() => onClick(d)}
                    stroke="black"
                    fill={selectedBar === d.AirlineID ? "#b09a0c" : "#5a1e8a"}
                />
            ))}
        <YAxis yScale={yScale} height={height} offsetX={offsetX}/>
        <XAxis xScale={xScale} width={width} height={height} />
    </g>
}