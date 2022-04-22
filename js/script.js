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
var cities = [
    {
        name: "Brussels",
        ip: "111.222.333.444",
        status: "off",
        latitude: 50.8371,
        longitude: 4.3676
    },
    {
        name: "Copenhagen",
        ip: "111.222.333.444",
        status: "off",
        latitude: 55.6763,
        longitude: 12.5681
    },
    {
        name: "Paris",
        ip: "111.222.333.444",
        status: "on",
        latitude: 48.8567,
        longitude: 2.351
    },
    {
        name: "Reykjavik",
        ip: "111.222.333.444",
        status: "on",
        latitude: 64.1353,
        longitude: -21.8952
    },
    {
        name: "Moscow",
        ip: "111.222.333.444",
        status: "on",
        latitude: 55.7558,
        longitude: 37.6176
    },
    {
        name: "Madrid",
        ip: "111.222.333.444",
        status: "on",
        latitude: 40.4167,
        longitude: -3.7033
    },
    {
        name: "London",
        ip: "111.222.333.444",
        status: "on",
        latitude: 51.5002,
        longitude: -0.1262
    },
    {
        name: "Peking",
        ip: "111.222.333.444",
        status: "off",
        latitude: 39.9056,
        longitude: 116.3958
    },
    {
        name: "New Delhi",
        ip: "111.222.333.444",
        status: "off",
        latitude: 28.6353,
        longitude: 77.225
    },
    {
        name: "Tokyo",
        ip: "111.222.333.444",
        status: "off",
        latitude: 35.6785,
        longitude: 139.6823
    },
    {
        name: "Ankara",
        ip: "111.222.333.444",
        status: "off",
        latitude: 39.9439,
        longitude: 32.856
    },
    {
        name: "Buenos Aires",
        ip: "111.222.333.444",
        status: "on",
        latitude: -34.6118,
        longitude: -58.4173
    },
    {
        name: "Brasilia",
        ip: "111.222.333.444",
        status: "on",
        latitude: -15.7801,
        longitude: -47.9292
    },
    {
        name: "Ottawa",
        ip: "111.222.333.444",
        status: "off",
        latitude: 45.4235,
        longitude: -75.6979
    },
    {
        name: "Washington",
        ip: "111.222.333.444",
        status: "on",
        latitude: 38.8921,
        longitude: -77.0241
    },
    {
        name: "Kinshasa",
        ip: "111.222.333.444",
        status: "off",
        latitude: -4.3369,
        longitude: 15.3271
    },
    {
        name: "Cairo",
        ip: "111.222.333.444",
        status: "off",
        latitude: 30.0571,
        longitude: 31.2272
    },
    {
        name: "Pretoria",
        ip: "111.222.333.444",
        status: "off",
        latitude: -25.7463,
        longitude: 28.1876
    }
];

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