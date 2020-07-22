// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 500;
// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};
// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
//Initial Params
var chosenXAis = "poverty";
// Set up x-scales for the chart
function xscale(censusData, chosenXAis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAis]) * 0.8,
            d3.max(censusData, d => d[chosenXAis]) * 1.2
        ])
        .range([0, chartWidth]);
    return xLinearScale;
}
// Load data from csv
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    var xLinearScale = xscale(censusData, chosenXAis);
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare)])
        .range([chartHeight, 0]);
    // Create chart axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    // append y axis
    chartGroup.append("g")
        .call(leftAxis);
    // Add data points (circles)
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .style("fill", "#009cff")
        .attr("opacity", ".5");
    chartGroup.selectAll("#scatter")
        .data(censusData)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .style("fill", "white")
        .attr("x", d => xLinearScale(d[chosenXAis]))
        .attr("y", d => yLinearScale(d.healthcare) + 5)
        .text(d => d.abbr);
    var labelGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeight+20})`);
    // text label for the x axis
    chartGroup.append("text")
        .attr("y", chartHeight + 1.5 * chartMargin.bottom / 2)
        .attr("x", chartWidth / 2)
        .classed("axis-text", true)
        .text("In Poverty (%)");
    // text label for the y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "3em")
        // .style("text-anchor", "middle")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");
});