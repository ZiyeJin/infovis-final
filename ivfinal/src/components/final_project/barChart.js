import React , { useState }from "react";
import { max, min, scaleBand, scaleLinear } from "d3";
import { XAxis, YAxis } from "./axes";


export function BarChart (props) {
    const {offsetX, offsetY, alldata, height, width, selectedIndex, setSelectedIndex, selectedDate, selectedBar, setSelectedBar} = props;
    //console.log(selectedIndex)
    const data = alldata.filter((d) => {
        return (
            d.Date.getFullYear() === selectedDate.getFullYear() &&
            d.Date.getMonth() === selectedDate.getMonth() &&
            d.Date.getDate() === selectedDate.getDate()
        );
    });

    let maximunRet = max(data, d => d.Return);
    let minimunRet = min(data, d => d.Return);
    
    const xScale = scaleLinear().range([0, width]).domain([minimunRet, maximunRet]).nice();
    const yScale = scaleBand().range([0, height]).domain(data.map(a => a.Index)).padding(0.2) //The domain is the list of ailines names
    let color = (d) => d.Index===selectedIndex? "#b09a0c":"#5a1e8a";
   
    //const [selectedBar, setSelectedBar] = useState(null);
    const onClick = (d) => {
        if (selectedBar === d.Index) {
            setSelectedIndex(null);
            setSelectedBar(null);
        } else {
            setSelectedIndex(d.Index);
            setSelectedBar(d.Index);
        }
    };

    return <g transform={`translate(${offsetX}, ${offsetY})`}>
        {data.map(d => (
                <rect
                    key={d.Index}
                    x={0}
                    y={yScale(d.Index)}
                    width={xScale(d.Return)}
                    height={yScale.bandwidth()}
                    onClick={() => onClick(d)}
                    stroke="black"
                    fill={selectedBar === d.Index ? "#b09a0c" : "#5a1e8a"}
                />
            ))}
        <YAxis yScale={yScale} height={height} offsetX={offsetX}/>
        <XAxis xScale={xScale} width={width} height={height} />
    </g>
}