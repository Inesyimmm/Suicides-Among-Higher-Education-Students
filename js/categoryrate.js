// https://bl.ocks.org/ypetya/02e6ce08aea9b10a76917df499e81dc8
// http://bl.ocks.org/cbjuan/43f10523858abf6053ae
// https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67

let catratemargin = {top: 55, right: 50, bottom: 50, left: 30}
    , catratewidth = 530 // Use the window's linewidth
    , catrateheight = 400; // Use the window's lineheight

/////////////////////////////
// type
typeExecute = function () {

    let catrate_svg = d3.select("#catrate").append("svg")
        .attr("width", catratewidth + catratemargin.left + catratemargin.right)
        .attr("height", catrateheight + catratemargin.top + catratemargin.bottom);

    let catratesvg = catrate_svg.append("g")
        .attr("transform", "translate(" + catratemargin.left + "," + catratemargin.top + ")");

    var x0 = d3.scaleBand().range([0, catratewidth]).padding(0.4);
    var x1 = d3.scaleBand();

    var typey = d3.scaleLinear()
        .rangeRound([catrateheight, 0]);

    var catxAxis = d3.axisBottom()
        .scale(x0);

    var catyAxis = d3.axisLeft()
        .scale(typey)
        .tickFormat(d3.format(".2s"));

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // var color = d3.scaleOrdinal()
       // .range(["lightblue","orange"]);

    var speed = 1000;


    var yBegin;

    var innerColumns = {
        "column1" : ["Male", "Female"]
        // "column2" : ["Female"],
    };

    d3.csv("data/cleaned/ratebysextype.csv").then(
        function(data) {
            var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Type"; });
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Type"; }));
            data.forEach(function(d) {
                var yColumn = new Array();
                d.columnDetails = columnHeaders.map(function(name) {
                    for (ic in innerColumns) {
                        if($.inArray(name, innerColumns[ic]) >= 0){
                            if (!yColumn[ic]){
                                yColumn[ic] = 0;
                            }
                            yBegin = yColumn[ic];
                            yColumn[ic] += +d[name];
                            return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
                        }
                    }
                });
                d.total = d3.max(d.columnDetails, function(d) {
                    return d.yEnd;
                });
            });

            x0.domain(data.map(function(d) { return d.Type; }));
            x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);

            typey.domain([0, d3.max(data, function(d) {
                return d.total;
            })]).nice();

            catratesvg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(0," + catrateheight + ")");

            catratesvg.selectAll(".xaxis").transition().duration(speed).call(catxAxis);

            catratesvg.append("g")
                .attr("class", "yaxis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".7em")
                .style("text-anchor", "end")
                .text("Rate");

            catratesvg.selectAll(".yaxis").transition().duration(speed).call(catyAxis);

            var _f1 = d3.format(".1f");

            var project_stackedbar = catratesvg.selectAll(".project_stackedbar")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { console.log(x0(d.Type)); return "translate(" + x0(d.Type) + ",0)"; })
                .on("mouseover", function() { typesextooltip.style("display", null); })
                .on("mouseout", function() { typesextooltip.style("display", "none"); })
                .on("mousemove", function(d, i) {
                    console.log(i);
                    console.log(data[i]);
                    var xPosition = d3.mouse(this)[0] - 50 + x0(d.Type);
                    var yPosition = d3.mouse(this)[1] - 25;
                    typesextooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    //typesextooltip.select("text").text(d.yEnd-d.yBegin);
                });

            project_stackedbar.exit().remove();

            project_stackedbar.selectAll("rect")
                .data(function(d) { return d.columnDetails; })
                .enter().append("rect")
                .attr("width", x1.bandwidth())
                .attr("x", function(d) {
                    return x1(d.column);
                })
                .attr("y", function(d) {
                    return typey(d.yEnd);
                })
                .attr("height", function(d) {
                    return typey(d.yBegin) - typey(d.yEnd);
                })
                .style("fill", function(d) {
                    return color(d.name);
                })
                .on("mouseover", function() { typesextooltip.style("display", null); })
                .on("mouseout", function() { typesextooltip.style("display", "none"); })
                .on("mousemove", function(d) {
                    typesextooltip.select("text").text(_f1(d.yEnd-d.yBegin));
                });

            var legend = catratesvg.selectAll(".legend")
                .data(columnHeaders.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", cateagewidth - 17)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", color);

            legend.append("text")
                .attr("x", cateagewidth - 24)
                .attr("y", 9.5)
                .attr("dy", ".32em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

            var typesextooltip = catratesvg.append("g")
                .attr("class", "typesextooltip")
                .style("display", "none");

            typesextooltip.append("rect")
                .attr("width", 60)
                .attr("height", 20)
                .attr("fill", "white")
                .style("z-index", 100)
                .style("opacity", 0.5);

            typesextooltip.append("text")
                .attr("x", 30)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");


        });

};

/////////////////////////////
// level
levelExecute = function () {

    let levelrate_svg = d3.select("#levelrate").append("svg")
        .attr("width", catratewidth + catratemargin.left + catratemargin.right)
        .attr("height", catrateheight + catratemargin.top + catratemargin.bottom);

    let levelratesvg = levelrate_svg.append("g")
        .attr("transform", "translate(" + catratemargin.left + "," + catratemargin.top + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // var color = d3.scaleOrdinal()
        // .range(["lightblue","orange"]);

//.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    var speed = 1000;

    var yBegin;

    var innerColumns = {
        "column1" : ["Male", "Female"]
        // "column2" : ["Female"],
    };

    var x0 = d3.scaleBand().range([0, catratewidth]).padding(0.4);
    var x1 = d3.scaleBand();

    var typey = d3.scaleLinear()
        .rangeRound([catrateheight, 0]);

    var catxAxis = d3.axisBottom()
        .scale(x0);

    var catyAxis = d3.axisLeft()
        .scale(typey)
        .tickFormat(d3.format(".2s"));

    d3.csv("data/cleaned/ratebysexlevel.csv").then(
        function(data) {
            var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Level"; });
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Level"; }));
            data.forEach(function(d) {
                var yColumn = new Array();
                d.columnDetails = columnHeaders.map(function(name) {
                    for (ic in innerColumns) {
                        if($.inArray(name, innerColumns[ic]) >= 0){
                            if (!yColumn[ic]){
                                yColumn[ic] = 0;
                            }
                            yBegin = yColumn[ic];
                            yColumn[ic] += +d[name];
                            return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
                        }
                    }
                });
                d.total = d3.max(d.columnDetails, function(d) {
                    return d.yEnd;
                });
            });

            x0.domain(data.map(function(d) { return d.Level; }));
            x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);

            typey.domain([0, d3.max(data, function(d) {
                return d.total;
            })]).nice();

            levelratesvg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(0," + catrateheight + ")");

            levelratesvg.selectAll(".xaxis").transition().duration(speed).call(catxAxis);

            levelratesvg.append("g")
                .attr("class", "yaxis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".7em")
                .style("text-anchor", "end")
                .text("Rate");

            levelratesvg.selectAll(".yaxis").transition().duration(speed).call(catyAxis);

            var _f1 = d3.format(".1f");

            var project_stackedbar = levelratesvg.selectAll(".project_stackedbar")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { console.log(x0(d.Type)); return "translate(" + x0(d.Level) + ",0)"; })
                .on("mouseover", function() { typesextooltip.style("display", null); })
                .on("mouseout", function() { typesextooltip.style("display", "none"); })
                .on("mousemove", function(d, i) {
                    console.log(i);
                    console.log(data[i]);
                    var xPosition = d3.mouse(this)[0] - 50 + x0(d.Level);
                    var yPosition = d3.mouse(this)[1] - 25;
                    typesextooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    //typesextooltip.select("text").text(d.yEnd-d.yBegin);
                });

            project_stackedbar.exit().remove();

            project_stackedbar.selectAll("rect")
                .data(function(d) { return d.columnDetails; })
                .enter().append("rect")
                .attr("width", x1.bandwidth())
                .attr("x", function(d) {
                    return x1(d.column);
                })
                .attr("y", function(d) {
                    return typey(d.yEnd);
                })
                .attr("height", function(d) {
                    return typey(d.yBegin) - typey(d.yEnd);
                })
                .style("fill", function(d) {
                    return color(d.name);
                })
                .on("mouseover", function() { typesextooltip.style("display", null); })
                .on("mouseout", function() { typesextooltip.style("display", "none"); })
                .on("mousemove", function(d) {
                    typesextooltip.select("text").text(_f1(d.yEnd-d.yBegin));
                });

            var legend = levelratesvg.selectAll(".legend")
                .data(columnHeaders.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", cateagewidth - 17)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", color);

            legend.append("text")
                .attr("x", cateagewidth - 24)
                .attr("y", 9.5)
                .attr("dy", ".32em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

            var typesextooltip = levelratesvg.append("g")
                .attr("class", "typesextooltip")
                .style("display", "none");

            typesextooltip.append("rect")
                .attr("width", 60)
                .attr("height", 20)
                .attr("fill", "white")
                .style("z-index", 100)
                .style("opacity", 0.5);

            typesextooltip.append("text")
                .attr("x", 30)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");


        });

};


/////////////////////////////
// Year of Study
yearExecute = function () {

    let yearrate_svg = d3.select("#yearrate").append("svg")
        .attr("width", catratewidth + catratemargin.left + catratemargin.right)
        .attr("height", catrateheight + catratemargin.top + catratemargin.bottom);

    let yearratesvg = yearrate_svg.append("g")
        .attr("transform", "translate(" + catratemargin.left + "," + catratemargin.top + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);
//.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    // var color = d3.scaleOrdinal()
        // s.range(["lightblue","orange"]);

    var speed = 1000;

    var yBegin;

    var innerColumns = {
        "column1" : ["Male", "Female"]
        // "column2" : ["Female"],
    };

    var x0 = d3.scaleBand().range([0, catratewidth]).padding(0.4);
    var x1 = d3.scaleBand();

    var typey = d3.scaleLinear()
        .rangeRound([catrateheight, 0]);

    var catxAxis = d3.axisBottom()
        .scale(x0);

    var catyAxis = d3.axisLeft()
        .scale(typey)
        .tickFormat(d3.format(".2s"));

    d3.csv("data/cleaned/ratebysexyear.csv").then(
        function(data) {
            var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Syear"; });
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Syear"; }));
            data.forEach(function(d) {
                var yColumn = new Array();
                d.columnDetails = columnHeaders.map(function(name) {
                    for (ic in innerColumns) {
                        if($.inArray(name, innerColumns[ic]) >= 0){
                            if (!yColumn[ic]){
                                yColumn[ic] = 0;
                            }
                            yBegin = yColumn[ic];
                            yColumn[ic] += +d[name];
                            return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,};
                        }
                    }
                });
                d.total = d3.max(d.columnDetails, function(d) {
                    return d.yEnd;
                });
            });

            x0.domain(data.map(function(d) { return d.Syear; }));
            x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);

            typey.domain([0, d3.max(data, function(d) {
                return d.total;
            })]).nice();

            yearratesvg.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(0," + catrateheight + ")");

            yearratesvg.selectAll(".xaxis").transition().duration(speed).call(catxAxis);

            yearratesvg.append("g")
                .attr("class", "yaxis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".7em")
                .style("text-anchor", "end")
                .text("Rate");

            yearratesvg.selectAll(".yaxis").transition().duration(speed).call(catyAxis);

            var _f1 = d3.format(".1f");

            var project_stackedbar = yearratesvg.selectAll(".project_stackedbar")
                .data(data)
                .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { console.log(x0(d.Syear)); return "translate(" + x0(d.Syear) + ",0)"; })
                .on("mouseover", function() { typesextooltip.style("display", null); })
                .on("mouseout", function() { typesextooltip.style("display", "none"); })
                .on("mousemove", function(d, i) {
                    console.log(i);
                    console.log(data[i]);
                    var xPosition = d3.mouse(this)[0] - 50 + x0(d.Syear);
                    var yPosition = d3.mouse(this)[1] - 25;
                    typesextooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    //typesextooltip.select("text").text(d.yEnd-d.yBegin);
                });

            project_stackedbar.exit().remove();

            project_stackedbar.selectAll("rect")
                .data(function(d) { return d.columnDetails; })
                .enter().append("rect")
                .attr("width", x1.bandwidth())
                .attr("x", function(d) {
                    return x1(d.column);
                })
                .attr("y", function(d) {
                    return typey(d.yEnd);
                })
                .attr("height", function(d) {
                    return typey(d.yBegin) - typey(d.yEnd);
                })
                .style("fill", function(d) {
                    return color(d.name);
                })
                .on("mouseover", function() { typesextooltip.style("display", null); })
                .on("mouseout", function() { typesextooltip.style("display", "none"); })
                .on("mousemove", function(d) {
                    typesextooltip.select("text").text(_f1(d.yEnd-d.yBegin));
                });

            var legend = yearratesvg.selectAll(".legend")
                .data(columnHeaders.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", cateagewidth - 17)
                .attr("width", 15)
                .attr("height", 15)
                .style("fill", color);

            legend.append("text")
                .attr("x", cateagewidth - 24)
                .attr("y", 9.5)
                .attr("dy", ".32em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

            var typesextooltip = yearratesvg.append("g")
                .attr("class", "typesextooltip")
                .style("display", "none");

            typesextooltip.append("rect")
                .attr("width", 60)
                .attr("height", 20)
                .attr("fill", "white")
                .style("z-index", 100)
                .style("opacity", 0.5);

            typesextooltip.append("text")
                .attr("x", 30)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");


        });

};




d3.select("#studytype-button").on("click", function () {
    d3.select("#levelrate svg").remove();
    d3.select("#yearrate svg").remove();
    typeExecute();
});

d3.select("#studylevel-button").on("click", function () {
    d3.select("#catrate svg").remove();
    d3.select("#yearrate svg").remove();
    levelExecute();
});

d3.select("#studyyear-button").on("click", function () {
    d3.select("#levelrate svg").remove();
    d3.select("#catrate svg").remove();
    yearExecute();
});




