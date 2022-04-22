var root = am5.Root.new("chart");
var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        projection: am5map.geoMercator()
    })
);
var cont = chart.children.push(
  am5.Container.new(root, {
    layout: root.horizontalLayout,
    x: 0,
    y: 0
  })
);
var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
backgroundSeries.mapPolygons.template.setAll({
    fill: "transparent",
    fillOpacity: 0,
    strokeOpacity: 0
});
backgroundSeries.data.push({
    geometry: am5map.getGeoRectangle(-700, -700, 700, 700)
});
var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
    })
);
polygonSeries.mapPolygons.template.setAll({
    fill: "#4500ff",
    fillOpacity: 1,
    strokeWidth: 1,
    stroke: "white"
});
var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
lineSeries.mapLines.template.setAll({
    stroke: "black",
    strokeOpacity: 1
});
var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
pointSeries.bullets.push(function (x, y, obj) {
    return am5.Bullet.new(root, {
        sprite: am5.Picture.new(root, {
            width: 16,
            height: 16,
            src: "img/erg_" + obj.dataContext.stat + ".png",
            fill: obj.dataContext.stat == "on" ? "#ff5031" : "gray",
            tooltipY: am5.percent(10),
            tooltipText: "[bold]{name}\n{ip}",
        })
    });
});

function addNode(node) {console.log(node);
    pointSeries.data.push({
        geometry: { type: "Point", coordinates: [node.longitude, node.latitude] },
        name: node.name,
        ip: node.address,
        stat: node.status
    });
}

var NODES = [];

var RAW = {
    all: [],
    connected: []
}

var updateWorker = new Worker("js/poll.js");//set new node --> poller.postMessage("213.239.193.208:9053");
var locatorWorker = new Worker("js/lookup.js");
updateWorker.onmessage = function(event) {
    for(let i = 0; i < event.data.all.length; i++) {
        if(!RAW.all.includes(event.data.all[i])) {
            RAW.all[RAW.all.length] = event.data.all[i];
            RAW.all[RAW.all.length - 1].status = "off";
        }
    }
    for(let i = 0; i < event.data.connected.length; i++) {
        if(!RAW.connected.includes(event.data.connected[i])) {
            RAW.connected[RAW.connected.length] = event.data.connected[i];
            RAW.connected[RAW.connected.length - 1].status = "on";
        }
    }
    locatorWorker.postMessage(RAW.connected);
};
locatorWorker.onmessage = function(event) {
    for(i in event.data) {
        NODES[NODES.length] = event.data[i];
        addNode(NODES[NODES.length - 1]);
    }
};


chart.appear(1000, 100);

//  http://213.239.193.208:9053/peers/connected
//  http://213.239.193.208:9053/peers/all
