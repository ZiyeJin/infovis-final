import { useRef, useEffect } from "react";
// import { groupBy } from "lodash"; // Import lodash for grouping
import * as d3 from "d3";

function TreeMap({ width, height, weights, selectedIndex }) {
  // Ref for SVG element
  const svgRef = useRef();
  console.log(selectedIndex)

  useEffect(() => {
    if (!weights || !selectedIndex) return;

    // Group weights data by index using lodash
    // Filter the weights data based on the selected index
    const filteredData = weights.filter((item) => item.Index === selectedIndex);

    // Convert filtered data to array of objects
    const data = filteredData.map((item) => ({
      Industry: item.Industry,
      MktCapPer: item.MktCapPer,
      // Optionally include other properties from the data if needed
    }));

    // Create hierarchy from filtered data
    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.MktCapPer || 0); // Sum market cap percentages


    // Initialize treemap layout
    const treemap = d3
      .treemap()
      .size([width, height])
      .padding(1)
      .round(true);

    // Generate treemap layout
    treemap(root);

    // Select SVG element
    const svg = d3.select(svgRef.current);

    // Remove existing elements
    svg.selectAll("*").remove();

    // Append rectangles for each node
    svg
      .selectAll("rect")
      .data(root.descendants().slice(1))
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("fill", "#5a1e8a")
      .style("stroke", "black");
      // .style("stroke-width", "2");

    // Add text labels for Industry
    svg
      .selectAll(".industry-text")
      .data(root.descendants().slice(1))
      .enter()
      .filter((d) => (d.x1 - d.x0) > 16) // Filter out small cells
      .append("text")
      .attr("class", "industry-text")
      .attr("x", (d) => (d.x0 + d.x1) / 2)
      .attr("y", (d) => (d.y0 + d.y1) / 2 - 10) // Position above the center
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("fill", "#fff954")
      // .style("font-size", "12px")
      .style("font-size", (d) => `${Math.min(12, (d.x1 - d.x0) / 8)}px`) // Scale font size
      .style("font-family", "cursive")
      .text((d) => d.data.Industry); // Display industry name as label

      // Add text labels for MktCapPer below Industry
    svg
      .selectAll(".mktcap-text")
      .data(root.descendants().slice(1))
      .enter()
      .filter((d) => (d.x1 - d.x0) > 16) // Filter out small cells
      .append("text")
      .attr("class", "mktcap-text")
      .attr("x", (d) => (d.x0 + d.x1) / 2)
      .attr("y", (d) => (d.y0 + d.y1) / 2 + 10) // Position below the center
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .style("fill", "#fff954")
      // .style("font-size", "12px")
      .style("font-size", (d) => `${Math.min(12, (d.x1 - d.x0) / 12)}px`) // Scale font size
      .text((d) => d.data.MktCapPer.toFixed(2)); // Display MktCapPer below Industry

  }, [weights, selectedIndex, width, height]); // Depend on relevant props and dimensions

  // Return SVG element
  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export { TreeMap };
