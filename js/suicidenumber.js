// https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

let numlinemargin = {top: 20, right: 50, bottom: 50, left: 30}
    , linewidth = 1100 // Use the window's linewidth
    , lineheight = 500; // Use the window's lineheight

let linesvg = d3.select("#suicidenum-linechart").append("svg")
    .attr("width", linewidth + numlinemargin.left + numlinemargin.right)
    .attr("height", lineheight + numlinemargin.top + numlinemargin.bottom)
    .append("g")
    .attr("transform", "translate(" + numlinemargin.left + "," + numlinemargin.top + ")");

let x = d3.scaleBand().rangeRound([0, linewidth]).padding(1.0),
    y = d3.scaleLinear().rangeRound([lineheight, 0]);

//let g = linesvg.append("g");
    //.attr("transform", "translate(" + numlinemargin.left + "," + numlinemargin.top + ")");
d3.csv("data/cleaned/deathsbyyear.csv").then(function(d) {
    d.Deaths = +d.Deaths;
    return d;
})
    .then(function(data) {
    //if (error) throw error;

    let line = d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Deaths); });

    x.domain(data.map(function(d) { return d.Year;}));

    //y.domain([0, d3.max(data, function(d) { return d.Deaths; })]).nice();
    y.domain([0, 120]).nice();
    linesvg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + lineheight + ")")
        .call(d3.axisBottom(x));

    linesvg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y).ticks(6))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Number of deaths");

    linesvg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    linesvg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.Year); })
        .attr("cy", function(d) { return y(d.Deaths); })
        .attr("r", 4)
        .on("mousemove", mousemove);

        //       .on("mousemove", mousemove);
    let focus = linesvg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 6);

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-year")
            .attr("x", 18)
            .attr("y", -2);

        //focus.append("text")
            //.attr("x", 0)
            //.attr("y", 0);
            //.text("Deaths: ");

        focus.append("text")
            .attr("class", "tooltip-deaths")
            .attr("x", 18)
            .attr("y", 18);

        let eventCapture = linesvg.append("rect")
            .attr("class", "overlay")
            .attr("width", linewidth)
            .attr("height", lineheight)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {

            var y0 = y.invert(d3.mouse(this)[1]);
            var x0 = d3.mouse(this)[0];
            var eachBand = x.step();

            let d = data[0];

                for (let i = 0; i < 17; i++) {

                    if (Math.round(y0) == data[i].Deaths && Math.round(((x0-1.0)/eachBand))== (i + 1)) {
                        d = data[i];
                        focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.Deaths) + ")");
                        focus.select(".tooltip-year").text(d.Year);
                        focus.select(".tooltip-deaths").text("Deaths: " + d.Deaths);
                    }
                }
        }
});