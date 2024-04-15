import React from "react";

function Routes(props){
    const {projection, routes, selectedAirline} = props;
    if(selectedAirline){
        let selectedRoutes = routes.filter(a => a.AirlineID === selectedAirline);
        return <g>
            {
                selectedRoutes.map( d => <line key={d.ID}
                            x1={ projection([d.SourceLongitude, d.SourceLatitude])[0]}
                            y1={ projection([d.SourceLongitude, d.SourceLatitude])[1]}
                            x2={ projection([d.DestLongitude, d.DestLatitude])[0]}
                            y2={ projection([d.DestLongitude, d.DestLatitude])[1]}
                            stroke={"#b09a0c"}
                            opacity={0.1}
                        >
                    </line>
                )}
            
        </g>
    } else {
        return <g>

        </g>
    }
}

export { Routes }