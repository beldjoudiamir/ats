import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const pastelColors = [
  "#A5D8FF", "#B2F2BB", "#FFD6A5", "#FFADAD", "#D0BFFF", "#B5EAD7"
];

export default function BarChartD3({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    const width = 220, height = 22 * data.length + 12;
    const margin = { top: 8, right: 12, bottom: 8, left: 80 };

    d3.select(ref.current).selectAll("*").remove();
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 1])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.top, height - margin.bottom])
      .padding(0.18);

    // Barres
    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", margin.left)
      .attr("y", d => y(d.label))
      .attr("width", d => x(d.value))
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => pastelColors[i % pastelColors.length])
      .attr("rx", 4)
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#339af0");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("fill", pastelColors[i % pastelColors.length]);
      });

    // Labels à gauche (text-anchor: start, ellipsis si trop long)
    svg.append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 2)
      .attr("y", d => y(d.label) + y.bandwidth() / 2 + 1)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .style("font-size", 11)
      .style("font-weight", 500)
      .style("fill", "#333")
      .style("max-width", `${margin.left - 6}px`)
      .style("overflow", "hidden")
      .style("text-overflow", "ellipsis")
      .style("white-space", "nowrap")
      .text(d => d.label);

    // Valeurs à droite
    svg.append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => margin.left + x(d.value) + 3)
      .attr("y", d => y(d.label) + y.bandwidth() / 2 + 1)
      .attr("alignment-baseline", "middle")
      .style("font-size", 11)
      .style("font-weight", 600)
      .style("fill", "#339af0")
      .text(d => d.value);
  }, [data]);

  return (
    <div className="flex flex-col items-center w-full">
      <svg ref={ref} style={{ maxWidth: 230, width: "100%", height: 22 * data.length + 12 }}></svg>
    </div>
  );
} 