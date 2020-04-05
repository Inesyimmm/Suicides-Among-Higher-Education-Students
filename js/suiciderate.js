// https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89

let ratelinemargin = {top: 20, right: 50, bottom: 50, left: 30}
    , ratelinewidth = 1100 // Use the window's ratelinewidth
    , ratelineheight = 500; // Use the window's ratelineheight

let ratelinesvg = d3.select("#suiciderate-linechart").append("svg")
    .attr("width", ratelinewidth + ratelinemargin.left + ratelinemargin.right)
    .attr("height", ratelineheight + ratelinemargin.top + ratelinemargin.bottom)
    .append("g")
    .attr("transform", "translate(" + ratelinemargin.left + "," + ratelinemargin.top + ")");

let ratex = d3.scaleBand().rangeRound([0, ratelinewidth]).padding(1.0),
    ratey = d3.scaleLinear().rangeRound([ratelineheight, 0]);

//let g = ratelinesvg.append("g");
//.attr("transform", "translate(" + ratelinemargin.left + "," + ratelinemargin.top + ")");
d3.csv("data/cleaned/ratebyyear.csv").then(function(d) {
    d.Rate = +d.Rate;
    console.log(d.Year);
    return d;
})
    .then(function(data) {
        //if (error) throw error;

        let rateline = d3.line()
            .x(function(d) { return ratex(d.Year); })
            .y(function(d) { return ratey(d.Rate); });

        ratex.domain(data.map(function(d) { return d.Year;}));

        //ratey.domain([0, d3.max(data, function(d) { return d.Rate; })]).nice();
        ratey.domain([0, 6]).nice();
        ratelinesvg.append("g")
            .attr("class", "xaxis")
            .attr("transform", "translate(0," + ratelineheight + ")")
            .call(d3.axisBottom(ratex));

        ratelinesvg.append("g")
            .attr("class", "yaxis")
            .call(d3.axisLeft(ratey).ticks(7))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Rate of deaths");

        ratelinesvg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", rateline);

        ratelinesvg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return ratex(d.Year); })
            .attr("cy", function(d) { return ratey(d.Rate); })
            .attr("r", 4)
            .on("mousemove", mousemove);

        //       .on("mousemove", mousemove);
        let ratefocus = ratelinesvg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        ratefocus.append("circle")
            .attr("r", 6);

        ratefocus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        ratefocus.append("text")
            .attr("class", "tooltip-year")
            .attr("x", 18)
            .attr("y", -2);

        //focus.append("text")
        //.attr("x", 0)
        //.attr("y", 0);
        //.text("Deaths: ");

        ratefocus.append("text")
            .attr("class", "tooltip-deaths")
            .attr("x", 18)
            .attr("y", 18);

        let eventCapture = ratelinesvg.append("rect")
            .attr("class", "overlay")
            .attr("width", ratelinewidth)
            .attr("height", ratelineheight)
            .on("mouseover", function() { ratefocus.style("display", null); })
            .on("mouseout", function() { ratefocus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {

            var y0 = ratey.invert(d3.mouse(this)[1]);
            var x0 = d3.mouse(this)[0];
            var eachBand = ratex.step();

            let d = data[0];

            for (let i = 0; i < 17; i++) {

                if (Math.round(y0 * 10) == data[i].Rate * 10 && Math.round(((x0-1.0)/eachBand))== (i + 1)) {
                    d = data[i];
                    ratefocus.attr("transform", "translate(" + ratex(d.Year) + "," + ratey(d.Rate) + ")");
                    ratefocus.select(".tooltip-year").text(d.Year);
                    ratefocus.select(".tooltip-deaths").text("Rate: " + d.Rate);
                }
            }
        }
    });