import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const pastelColors = [
  "#A5D8FF", "#B2F2BB", "#FFD6A5", "#FFADAD", "#D0BFFF", "#B5EAD7"
];

export default function ColumnChartD3({ data }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    const width = 1500;
    const height = 140;
    const margin = { top: 20, right: 10, bottom: 48, left: 10 };

    d3.select(ref.current).selectAll("*").remove();
    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.32);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Barres verticales
    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", (d, i) => pastelColors[i % pastelColors.length])
      .attr("rx", 6)
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#339af0");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("fill", pastelColors[i % pastelColors.length]);
      });

    // Valeurs au-dessus
    svg.append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => x(d.label) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 6)
      .attr("text-anchor", "middle")
      .style("font-size", 13)
      .style("font-weight", 600)
      .style("fill", "#339af0")
      .text(d => d.value);

    // Labels sous les barres (plus bas)
    svg.append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => x(d.label) + x.bandwidth() / 2)
      .attr("y", height - margin.bottom + 32)
      .attr("text-anchor", "middle")
      .style("font-size", 13)
      .style("font-weight", 500)
      .style("fill", "#333")
      .text(d => d.label);
  }, [data]);

  return (
    <div className="flex flex-col items-center w-full">
      <svg ref={ref} style={{ maxWidth: 1500, width: "100%", height: 140 }}></svg>
    </div>
  );
} 