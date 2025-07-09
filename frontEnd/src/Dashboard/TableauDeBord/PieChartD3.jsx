import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const pastelColors = [
  "#A5D8FF", "#B2F2BB", "#FFD6A5", "#FFADAD", "#D0BFFF", "#B5EAD7"
];

export default function PieChartD3({ data }) {
  const ref = useRef();
  const legendRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 340, height = 240, radius = Math.min(width, height) / 2 - 10;
    const color = d3.scaleOrdinal().range(pastelColors);

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(data);
    const arc = d3.arc().innerRadius(40).outerRadius(radius);
    const arcOver = d3.arc().innerRadius(40).outerRadius(radius + 10);

    // Animation d'apparition
    svg.selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .style("transition", "all 0.2s")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arcOver).style("filter", "drop-shadow(0 2px 8px #8882)");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).transition().duration(200).attr("d", arc).style("filter", "none");
      })
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      });

    // Labels valeur + %
    svg.selectAll("text")
      .data(data_ready)
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", 13)
      .style("font-weight", 600)
      .style("fill", "#333")
      .text(d => {
        const total = d3.sum(data, d => d.value);
        const percent = total ? Math.round((d.data.value / total) * 100) : 0;
        return `${d.data.value} (${percent}%)`;
      });

    // Légende
    d3.select(legendRef.current).selectAll("*").remove();
    const legend = d3.select(legendRef.current)
      .append("div")
      .attr("class", "flex flex-wrap justify-center gap-4 mt-2");
    data.forEach((d, i) => {
      legend.append("div")
        .attr("class", "flex items-center gap-2 mb-1")
        .html(`
          <span style="display:inline-block;width:16px;height:16px;background:${pastelColors[i % pastelColors.length]};border-radius:3px;"></span>
          <span style="font-size:14px;">${d.label}</span>
        `);
    });
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref} style={{ maxWidth: 340, height: 240 }}></svg>
      <div ref={legendRef} className="w-full"></div>
    </div>
  );
} 