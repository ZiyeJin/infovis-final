import React from "react";
import 'bootstrap/dist/css/bootstrap.css'
import { csv, json } from "d3";
import { Row, Col, Container } from "react-bootstrap";
import { groupByAirline, groupByAirport } from "../components/final_project/utils";
import styles from "../styles/finalproject_styles.module.css";
import { AirportMap }  from "../components/final_project/airportMap";
import { BarChart } from "../components/final_project/barChart";
import { AirportBubble} from "../components/final_project/airportBubble";
import {Tooltip} from '../components/final_project/tooltips';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const csvUrl = 'https://gist.githubusercontent.com/hogwild/9367e694e12bd2616205e4b3e91285d5/raw/9b451dd6bcc148c3553f550c92096a1a58e1e1e5/airline-routes.csv';
const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';


function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.SourceLatitude = +d.SourceLatitude
                d.SourceLongitude = +d.SourceLongitude
                d.DestLatitude = +d.DestLatitude
                d.DestLongitude = +d.DestLongitude
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(geoJsonData => {
            setData(geoJsonData);
        })
    }, []);
    return data;
}


function AirlineRoutes(){
    const [selectedAirline, setSelectedAirline]=React.useState(null);
    const [tooltipX, setTooltipX] = React.useState(null);
    const [tooltipY, setTooltipY] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const barchart_width = 400;
    const barchart_height = 400;
    const barchart_margin = { top: 10, bottom: 50, left: 130, right: 10 };
    const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
    const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
    const map_width = 600;
    const map_height = 400;
    const hub_width = 400;
    const hub_height = 400;

    const routes = useData(csvUrl);
    const map = useMap(mapUrl);
    if (!map || !routes) {
        return <pre>Loading...</pre>;
    };
    let airlines = groupByAirline(routes);
    let airports = groupByAirport(routes);
    
    
    const handleMouseMove = (event) => {
        console.log('Mouse position:', event.pageX, event.pageY);
        setTooltipX(event.pageX)
        setTooltipY(event.pageY)
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    
    // console.log(cities);
    // console.log(airports);

    return (<Container >
            <Row className={"justify-content-md-left"}>
                <Col lg={10} >
                    <h1 className={styles.h1Style}>Indexs Performance</h1> 
                </Col>
            </Row> 
            <Row>
                <Col lg={3} md={2}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                    />
                </Col>
            </Row>
            <Row className={"justify-content-md-left"}>
                <Col lg={4}>
                    <h2>Indexs</h2>
                    <svg className={styles.svgStyle} id={"barchart"} width={barchart_width} height={barchart_height} onMouseMove={handleMouseMove}>
                        <BarChart offsetX={barchart_margin.left} offsetY={barchart_margin.top} 
                            height={barchart_inner_height} width={barchart_inner_width} data={airlines}
                            selectedAirline={selectedAirline} setSelectedAirline={setSelectedAirline}
                        />
                    </svg>
                </Col>
                <Col lg={8}>
                    <h2>Stock Exchanges</h2>
                    <svg className={styles.svgStyle} id={"map"} width={map_width} height={map_height}>
                        <AirportMap width={map_width} height={map_height} 
                            countries={map} airports={airports} routes={routes}
                            selectedAirline={selectedAirline}
                        />
                    </svg>
                </Col>
            </Row>
            <Row>
                <Col lg={4}>
                    <h2>The Tree Map</h2>
                    <svg className={styles.svgStyle} id={"bubble"} width={hub_width} height={hub_height}>
                        <AirportBubble width={hub_width} height={hub_height} 
                            routes={routes} selectedAirline={selectedAirline}
                        />
                    </svg>
                </Col>
            </Row> 
            {tooltipX !== null && (
            <Tooltip
                d={airlines.find((d) => d.AirlineID === selectedAirline)}
                x={tooltipX}
                y={tooltipY}
            />
            )}
            </Container>)
}


export default AirlineRoutes