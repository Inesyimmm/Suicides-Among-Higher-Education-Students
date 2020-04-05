let ageratemargin = {top: 57, right: 50, bottom: 50, left: 30}
    , ageratewidth = 530 // Use the window's linewidth
    , agerateheight = 400; // Use the window's lineheight

let ageratesvg = d3.select("#agetype-barchart").append("svg")
    .attr("width", ageratewidth + ageratemargin.left + ageratemargin.right)
    .attr("height", agerateheight + ageratemargin.top + ageratemargin.bottom)
    .append("g")
    .attr("transform", "translate(" + ageratemargin.left + "," + ageratemargin.top + ")");

var ageratex = d3.scaleBand()
    .rangeRound([0, ageratewidth])
    .padding(0.4);

var ageratey = d3.scaleLinear()
    .rangeRound([agerateheight, 0]);

var arcolorScale = d3.scaleOrdinal()
    .range(["steelblue", "darkorange", "lightblue", "orange"]);   //(d3.schemeCategory10);

d3.csv("data/cleaned/ratebyage.csv").then(function (data) {
    ageratex.domain(data.map(function (d) {
        return d.Age;
    }));
    // ageratey.domain([0, d3.max(data, function (d) {
    //     return Number(d.Rate);
    // })]);
    ageratey.domain([0, 10]);

    ageratesvg.append("g")
        .attr("transform", "translate(0," + agerateheight + ")")
        .attr("class", "xaxis")
        .call(d3.axisBottom(ageratex));

    ageratesvg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(ageratey).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Rate");

    ageratesvg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        //.attr("class", "bar")
        .attr("x", function (d) {
            return ageratex(d.Age);
        })
        .attr("y", function (d) {
            return ageratey(Number(d.Rate));
        })
        .attr("width", ageratex.bandwidth())
        .attr("height", function (d) {
            return agerateheight - ageratey(Number(d.Rate));
        })
        .style("fill", d=>arcolorScale(d.Age));

    let text = ageratesvg.selectAll(".ageratetext")
        .data(data, d => d.Age);

    text.exit().remove();

    text.enter().append("text")
        .attr("class", "ageratetext")
        .attr("text-anchor", "middle")
        .style("fill", "#eeeeee")
        .merge(text)
        .transition().duration(2000)
        .attr("x", d => ageratex(d.Age) + ageratex.bandwidth() / 2)
        .attr("y", d => ageratey(Number(d.Rate)) - 5)
        .text(d => Number(d.Rate));
});