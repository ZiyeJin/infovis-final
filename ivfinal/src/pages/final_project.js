import React from "react";
import 'bootstrap/dist/css/bootstrap.css'
import { csv, json } from "d3";
import { Row, Col, Container } from "react-bootstrap";
import { groupByIndex } from "../components/final_project/utils";
import styles from "../styles/finalproject_styles.module.css";
import { Map }  from "../components/final_project/Map";
import { TreeMap }  from "../components/final_project/treeMap";
import { BarChart } from "../components/final_project/barChart";
import {Tooltip} from '../components/final_project/tooltips';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const mapUrl = 'https://gist.githubusercontent.com/hogwild/26558c07f9e4e89306f864412fbdba1d/raw/5458902712c01c79f36dc28db33e345ee71487eb/countries.geo.json';
const weightsUrl = "https://raw.githubusercontent.com/Log1c11/data/main/industry_weight.csv"
const dataUrl = "https://raw.githubusercontent.com/Log1c11/data/main/merged_data.csv"



function useWeights(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.MktCapPer = +d.MktCapPer
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

function useStkData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                const [year, month, day] = d.Date.split("/").map(Number);
                d.Date = new Date(year, month - 1, day); // Create Date object (month is zero-based)
                
                d.Latitude = +d.Latitude
                d.Longitude = +d.Longitude
                d.High = +d.High
                d.Low = +d.Low
                d.Close = +d.Close
                d.Open = +d.Open
                d.Volume = +d.Volume
                d.Return = +d.Return
                d.AdjClose = +d.AdjClose
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


function IndexPerformance(){
    const [tooltipX, setTooltipX] = React.useState(null);
    const [tooltipY, setTooltipY] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(new Date('2022-01-03'));
    const [selectedIndex, setSelectedIndex]=React.useState(null);
    const [selectedBar, setSelectedBar] = React.useState(null);

    const barchart_width = 400;
    const barchart_height = 400;
    const barchart_margin = { top: 10, bottom: 50, left: 80, right: 100 };
    const barchart_inner_width = barchart_width - barchart_margin.left - barchart_margin.right;
    const barchart_inner_height = barchart_height - barchart_margin.top - barchart_margin.bottom;
    const map_width = 635;
    const map_height = 600;
    const hub_width = 635;
    const hub_height = 600;


    //
    const weights = useWeights(weightsUrl)
    const stkdata = useStkData(dataUrl)
   

    const map = useMap(mapUrl);
    if (!map || !stkdata) {
        return <pre>Loading...</pre>;
    };

    
    
    const handleMouseMove = (event) => {
        // console.log('Mouse position:', event.pageX, event.pageY);
        setTooltipX(event.pageX)
        setTooltipY(event.pageY)
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleSelectIndexChanged = (index) => {
        setSelectedIndex(index);
        setSelectedBar(index);
    };


    return (<Container >
            <Row className={"justify-content-md-left"}>
                <Col lg={12} >
                    <h1 className={styles.h1Style}>Indexs Performance</h1> 
                </Col>
            </Row> 
            <Row>
                <Col lg={3}>
                    <h2>Calendar</h2>
                    <DatePicker
                        inline
                        selected={selectedDate}
                        // onChange={handleDateChange}
                        onChange={date => setSelectedDate(date)}
                        dateFormat="yyyy/MM/dd"
                        minDate={new Date('2022-01-03')}
                        maxDate={new Date('2022-11-08')}
                    />
                </Col>
                <Col lg={3}>
                    <h2>Indexs</h2>
                    <svg className={styles.svgStyle} id={"barchart"} width={barchart_width} height={barchart_height} onMouseMove={handleMouseMove}>
                        <BarChart offsetX={barchart_margin.left} offsetY={barchart_margin.top} 
                            height={barchart_inner_height} width={barchart_inner_width} alldata={stkdata}
                            selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} selectedDate={selectedDate} 
                            selectedBar = {selectedBar} setSelectedBar={setSelectedBar}
                        />
                    </svg>
                </Col>
            </Row>
            <Row className={"justify-content-md-left"}>
                <Col lg={6}>
                    <h2>Stock Exchanges</h2>
                    <svg className={styles.svgStyle} id={"map"} width={map_width} height={map_height}>
                        <Map width={map_width} height={map_height} 
                            countries={map} alldata={stkdata}
                            selectedIndex={selectedIndex} selectedDate={selectedDate} 
                            setSelectedIndex={handleSelectIndexChanged} setSelectedBar={setSelectedBar}
                        />
                    </svg>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <h2>The Tree Map</h2>
                    <svg className={styles.svgStyle} id={"tree"} width={hub_width} height={hub_height}>
                        <TreeMap width={hub_width} height={hub_height} 
                            weights={weights} selectedIndex={selectedIndex} 
                        />
                    </svg>
                </Col>
            </Row> 
            {tooltipX !== null && (
            <Tooltip
                d={stkdata.find((d) => d.Index === selectedIndex)}
                x={tooltipX}
                y={tooltipY}
            />
            )}
            </Container>)
}


export default IndexPerformance