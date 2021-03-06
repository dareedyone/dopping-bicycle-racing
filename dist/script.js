const width = 900,height = 550,padding = 60,specifierMS = "%M:%S",specifierY = "%Y";
//tooltip tweak
var div = d3.select("body").append("div").
attr("class", "tooltip").
attr("id", "tooltip").
style("opacity", 0);


const drawPlots = data => {
  const svg = d3.select("#svgcontainer").
  append("svg").
  attr("width", width).
  attr("height", height).
  attr("class", "bg-light");

  //x label
  // svg.append("text")
  // .attr("transform", "rotate(-90)")
  // .style("font-size", 18)
  // .text("Time in Minutes")
  // .attr("x", 200)
  // .attr("y", 150);


  const minTime = d3.min(data, d => new Date(`January 1, 1970 0:${d.Time}`)),
  maxTime = d3.max(data, d => new Date(`January 1, 1970 0:${d.Time}`)),
  minYear = d3.min(data, d => d3.timeParse(specifierY)(d.Year - 1)),
  maxYear = d3.max(data, d => d3.timeParse(specifierY)(d.Year + 1)),
  xScale = d3.scaleTime().
  domain([minYear, maxYear]).
  range([padding, width - padding]),
  yScale = d3.scaleTime().
  domain([maxTime, minTime]).
  range([height - padding, padding]),
  xAxis = d3.axisBottom(xScale),

  // .tickFormat(function(d){
  //      return d3.timeFormat(specifierY)(d)
  //  })
  yAxis = d3.axisLeft(yScale).
  tickFormat(function (d) {
    return d3.timeFormat(specifierMS)(d);
  });




  svg.append("g").
  attr("transform", `translate(0, ${height - padding})`).
  attr("id", "x-axis").
  call(xAxis);

  svg.append("g").
  attr("transform", `translate(${padding}, 0)`).
  attr("id", "y-axis").
  call(yAxis);


  svg.selectAll("circle").
  data(data).
  enter().
  append("circle").
  attr("data-xvalue", d => d3.timeParse(specifierY)(d.Year)).
  attr("data-yvalue", d => new Date(`January 1, 1970 0:${d.Time}`)).
  attr("cx", d => xScale(d3.timeParse(specifierY)(d.Year))).
  attr("cy", d => yScale(new Date(`January 1, 1970 0:${d.Time}`))).
  attr("r", 6).
  style("fill", d => d.Doping != "" ? "#4d94ff" : "#ffcc80").
  style("stroke", "black").
  attr("class", "dot").
  on("mouseover", function (d) {
    div.style("opacity", 0.9);
    div.attr("data-year", d3.timeParse(specifierY)(d.Year));
    div.html(d.Name + ": " + d.Nationality + "<br/>" +
    "Year: " + d.Year + ", Time: " + d.Time + (
    d.Doping ? "<br/><br/>" + d.Doping : "")).
    style("left", d3.event.pageX + "px").
    style("top", d3.event.pageY - 28 + "px");
  }).on("mouseout", function (d) {
    div.style("opacity", 0);
  });

  //legend
  const legend = svg.append("g").
  attr("id", "legend");

  legend.append("text").
  text("No doping allegations").
  style("font-size", "10px").
  attr("transform", `translate(${width - 150}, ${height / 2})`);

  legend.append("rect").
  attr("width", 20).
  attr("height", 20).
  style("fill", "#4d94ff").
  attr("transform", `translate(${width - 35}, ${height / 2 - 13})`);

  legend.append("text").
  text("Riders with doping allegations").
  style("font-size", "10px").
  attr("transform", `translate(${width - 185}, ${height / 2 + 20})`);

  legend.append("rect").
  attr("width", 20).
  attr("height", 20).
  style("fill", "#ffcc80").
  attr("transform", `translate(${width - 35}, ${height / 2 + 10})`);


};




d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', { 'Access-Control-Allow-Origin': '*' }).
then(data => {
  // console.log("yaweeee");
  // console.log(data);  
  drawPlots(data);
}).catch(err => console.log(err));