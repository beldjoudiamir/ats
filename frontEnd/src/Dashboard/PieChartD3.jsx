import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function PieChartD3({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 320, height = 220, radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select(ref.current).selectAll("*").remove(); // Clean svg

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(data);

    svg.selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", d => color(d.data.label))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    svg.selectAll("text")
      .data(data_ready)
      .enter()
      .append("text")
      .text(d => d.data.label)
      .attr("transform", d => `translate(${d3.arc().innerRadius(0).outerRadius(radius).centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 13);
  }, [data]);

  return <svg ref={ref}></svg>;
} 