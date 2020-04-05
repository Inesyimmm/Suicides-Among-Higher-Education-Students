// http://bl.ocks.org/jamesleesaunders/36ccc5e130948c098209

function randomDataset() {
    var data = {
        "key": "Ethnicity",
        "values": [{
            "key": "White",
            "value": 5.1
        }, {
            "key": "Black",
            "value": 2.7
        }, {
            "key": "Asian",
            "value": 5.4
        }, {
            "key": "Other",
            "value": 5.9
        }]
    };
    return data;
}

var chart = d3.ez.chart.polarAreaChart().colors(d3.ez.palette.diverging(2));
var legend = d3.ez.component.legend().title('Ethnicities');
var title = d3.ez.component.title().mainText("").subText("");

// Create chart base
var myChart = d3.ez.base()
    .width(550)
    .height(400)
    .chart(chart)
    .legend(legend)
    .title(title)
    .on("customValueMouseOver", function(d, i) {
        d3.select("#message").text(d.value);
    });

// Add to page
function update() {
    var data = randomDataset();
    d3.select("#ethtype-barchart")
        .datum(data)
        .call(myChart);
}

update();
setInterval(update, 2000);