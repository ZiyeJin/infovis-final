import {useRef, React,useEffect} from "react";
import { groupByIndex } from "./utils";
import * as d3 from "d3";

function TreeMap({ width, height, weights, selectedIndex}) {
    // console.log(groupByIndex(weights))
    const svgRef = useRef();

    useEffect(() => {
      if (!weights || !selectedIndex) return;

      // Group weights data by index
      const groupedData = groupByIndex(weights);

      // Find the selected index in the grouped data
      const selectedData = groupedData.find((group) => group.index === selectedIndex);

      if (!selectedData) return;

      const root = d3.hierarchy({ children: selectedData.MktCapPer })
        .sum((d) => d.MktCapPer); 

      const treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true);

      treemap(root);

      const svg = d3.select(svgRef.current);

      svg.selectAll("rect")
        .data(root.descendants().slice(1)) 
        .enter()
        .append("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .style("fill", "#5a1e8a")
        .style("stroke", "black")
        .style("stroke-width", "2");

      // Add text labels
      svg.selectAll("text")
        .data(root.descendants().slice(1)) // Exclude the root node
        .enter()
        .append("text")
        .attr("x", (d) => (d.x0 + d.x1) / 2)
        .attr("y", (d) => (d.y0 + d.y1) / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", "#fff954")
        .style("font-size", "16px")
        .style("font-family", "cursive")
        .text((d) => d.Industry); // Display component name as label
    }, [weights, selectedIndex, width, height]);

    return <svg ref={svgRef} width={width} height={height}></svg>;
    }
    
  
export {TreeMap};
