let def_width = 700;
let def_height = 300;
let def_padding_top = 250;
let def_padding_left = 20;

let svg = d3.select("#suicide-def")
    //.append("svg")
    .attr("width", def_width)
    .attr("height", def_height);

let agedata = [0, 125, 200, 500];
let agetext = ['0', '10', '15'];

let ordinal = d3.scaleOrdinal()
    .range(agedata);

let xScale = ordinal.domain(agetext);

let simaxis = d3.axisBottom(xScale);

let xAxis = svg.append("g")
    .attr("class","axis")
    .attr("transform",`translate(${def_padding_left}, ${def_padding_top})`)
    .style("stroke-width", "3px")
    .call(simaxis);

$('#hint-container')
    .hide();

$('.age-ten')
    .hide();

$('.age-fifteen')
    .hide();

let imagedis = svg.append("image")
    .attr("class", "image")
    //.attr("id", "image-white")
    .attr("width", 80)
    .attr("height", 80)
    .attr("xlink:href", "images/woman-white.png")
    .attr("transform",`translate(${-500}, ${170})`);
    //.on("mouseover", function() {
    //    $('.age-ten')
    //       .show();
    //});
imagedis.transition()
    .duration(10000)
    .ease(d3.easeLinear)
    .attr("transform",`translate(${450}, ${170})`)
    .style("opacity", 1);

let suicideimg1 = svg.append("image")
    .attr("class", "image")
    .attr("id", "image-red1")
    .attr("width", 80)
    .attr("height", 80)
    .style("opacity", 0)
    .attr("xlink:href", "images/woman-red.png")
    .attr("transform",`translate(${105}, ${170})`);

suicideimg1.transition().delay(6400)
    .ease(d3.easeLinear)
    .style("opacity", 1)
    .attr("transform",`translate(${105}, ${170})`);

let suicideimg2 = svg.append("image")
    .attr("class", "image")
    .attr("id", "image-red2")
    .attr("width", 80)
    .attr("height", 80)
    .style("opacity", 0)
    .attr("xlink:href", "images/woman-red.png")
    .attr("transform",`translate(${180}, ${170})`);

suicideimg2.transition().delay(7000)
    .ease(d3.easeLinear)
    .style("opacity", 1)
    .attr("transform",`translate(${180}, ${170})`);

svg.selectAll("#image-red1").on("mouseover", function () {
    console.log("Yes!");
    $('#hint-container')
           .show();
    $('.age-ten')
        .toggle();
    $('.age-fifteen')
        .hide();
});

svg.selectAll("#image-red1").on("mouseout", function () {
    console.log("Yes!");
    $('#hint-container')
        .hide();
});

svg.selectAll("#image-red2").on("mouseover", function () {
    console.log("Yes!");
    $('#hint-container')
        .show();
    $('.age-ten')
        .hide();
    $('.age-fifteen')
        .toggle();

});

svg.selectAll("#image-red2").on("mouseout", function () {
    console.log("Yes!");
    $('#hint-container')
        .hide();
});


$(function() {
    $('#fullpage')
        .fullpage({
            navigation: true,
            menu: '#main-menu',

            onLeave: function(index, nextIndex) {}
        });
});

// when you click on a citation, go to the citations slide
$('sup.citation')
    .on('click', function() {
        $.fn.fullpage.moveTo(12);
    });

