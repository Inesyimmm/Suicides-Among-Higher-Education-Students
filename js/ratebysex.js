let sexratemargin = {top: 20, right: 50, bottom: 50, left: 30}
    , sexratewidth = 530 // Use the window's linewidth
    , sexrateheight = 400; // Use the window's lineheight

let sexratesvg = d3.select("#sextype-barchart").append("svg")
    .attr("width", sexratewidth + sexratemargin.left + sexratemargin.right)
    .attr("height", sexrateheight + sexratemargin.top + sexratemargin.bottom)
    .append("g")
    .attr("transform", "translate(" + sexratemargin.left + "," + sexratemargin.top + ")");

var sexratex = d3.scaleBand()
    .rangeRound([0, sexratewidth])
    .padding(0.4);

var sexratey = d3.scaleLinear()
    .rangeRound([sexrateheight, 0]);

var srcolorScale = d3.scaleOrdinal(d3.schemeCategory10);
    //.range(["white","orange"]);   //(d3.schemeCategory10);

d3.csv("data/cleaned/ratebysex.csv").then(function (data) {
    sexratex.domain(data.map(function (d) {
        return d.Sex;
    }));
    // sexratey.domain([0, d3.max(data, function (d) {
    //     return Number(d.Rate);
    // })]);
    sexratey.domain([0, 10]);

    sexratesvg.append("g")
        .attr("transform", "translate(0," + sexrateheight + ")")
        .attr("class", "xaxis")
        .call(d3.axisBottom(sexratex));

    sexratesvg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(sexratey).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Rate");

    sexratesvg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        //.attr("class", "bar")
        .attr("x", function (d) {
            return sexratex(d.Sex);
        })
        .attr("y", function (d) {
            return sexratey(Number(d.Rate));
        })
        .attr("width", sexratex.bandwidth())
        .attr("height", function (d) {
            return sexrateheight - sexratey(Number(d.Rate));
        })
        .style("fill", d=>srcolorScale(d.Sex));

    let text = sexratesvg.selectAll(".sexratetext")
        .data(data, d => d.Sex);

    text.exit().remove();

    text.enter().append("text")
        .attr("class", "sexratetext")
        .attr("text-anchor", "middle")
        .style("fill", "#eeeeee")
        .merge(text)
        .transition().duration(2000)
        .attr("x", d => sexratex(d.Sex) + sexratex.bandwidth() / 2)
        .attr("y", d => sexratey(Number(d.Rate)) - 5)
        .text(d => Number(d.Rate));
});