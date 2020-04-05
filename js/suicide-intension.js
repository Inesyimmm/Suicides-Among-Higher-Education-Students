let intend_width = 500;    //画布的宽度
let intend_height = 500;   //画布的高度

function gridData() {
    let data = [];
    let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    let ypos = 1;
    let width = 50;
    let height = 50;

    // iterate for rows
    for (let row = 0; row < 10; row++) {
        data.push( new Array() );

        // iterate for cells/columns inside rows
        for (let column = 0; column < 10; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height
            });
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;
    }
    return data;
}

let griddata = gridData();
// I like to log the data to the console for quick debugging
console.log(griddata);

let grid = d3.select("#suicide-intend")
    .attr("width","510px")
    .attr("height","510px");

let row = grid.selectAll(".row")
    .data(griddata)
    .enter().append("g")
    .attr("class", "row");

//var ind = 1;

let peopleimage = row.selectAll(".square")
    .data(function(d) { return d;})
    .enter().append("image")
    .attr("class", "person")
    .attr("width", function(d) { return d.width - 10;})
    .attr("height", function(d) { return d.height - 10;})
    .attr("transform", function (d) {return `translate(${d.x}, ${d.y})`})
    .attr("xlink:href", "images/woman-white.png");

let randomNum1 = Math.floor(Math.random() * 10);
let randomNum2 = Math.floor(Math.random() * 10);

redposnum = redpos();
console.log(redposnum);

function redpos() {
    var redposdata = [];

    for (var ind = 0; ind < 10; ind++) {
        redposdata.push(Math.floor(Math.random() * 10));
    }
    return redposdata;
}

let redx = griddata.slice(0, 10).slice(redposnum);
let redy = griddata.slice(0, 10)[redposnum];

d3.select("#intention-button").on("click", function () {
    for (let j = 0; j < 10; j++) {
        let rx = griddata[j][redposnum[j]].x;
        let ry = griddata[j][redposnum[j]].y;
        console.log(redposnum[j]);
        let intendimage2 = row.selectAll(".square")
            .data(griddata[j])
            .enter().append("image")
            .attr("class", "redperson")
            .attr("id", "redperson")
            .attr("width", function(d) { console.log(d.width); return d.width - 10;})
            .attr("width", function(d) { return d.width - 10;})
            .attr("height", function(d) { return d.height - 10;})
            //.attr("transform", function (d) {return `translate(${d.x}, ${d.y})`})
            .attr("transform", function (d) {return `translate(${rx}, ${ry})`})
            .attr("xlink:href", "images/woman-red.png");
    }

    $('#survivor-quote')
        .show();
});






