import React from "react";
import { geoPath, geoMercator } from "d3-geo";



function Map(props){
    const {width, height, countries, alldata, selectedIndex, selectedDate, setSelectedIndex, setSelectedBar} = props;
    const handlePointClick = (index) => {
        setSelectedIndex(index);
        setSelectedBar(index);
    };

    const data = alldata.filter((d) => {
        
        return (
            d.Date.getFullYear() === selectedDate.getFullYear() &&
            d.Date.getMonth() === selectedDate.getMonth() &&
            d.Date.getDate() === selectedDate.getDate()
        );
    });

    let projection = geoMercator().fitSize([width, height], countries);
    projection.scale(100)
            .translate([width / 2, height / 2]);
    const pathGenerator = geoPath().projection(projection);

    return(
        <svg width={width} height={height}>
            <g>
                {countries.features.map((feature, index) => (
                        <path
                            key={index}
                            d={pathGenerator(feature)}
                            fill="#eee"
                            stroke="#ccc"
                        />
                    ))}
                {data.map((d) => (
                    <circle
                        key={d.Index}
                        cx={projection([d.Longitude, d.Latitude])[0]}
                        cy={projection([d.Longitude, d.Latitude])[1]}
                        r={d.Index === selectedIndex ? 8 : 3} 
                        fill={d.Return < 0 ? "#008000" : "#FF0000"} 
                        onClick={() => handlePointClick(d.Index)}
                    />
                ))}
            </g>
        </svg>
    )
}

export { Map }