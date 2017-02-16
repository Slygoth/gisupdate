var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('MIYA ROOT API');
    // res.sendFile(__dirname + '/public/map.html');
});

app.use(express.static(__dirname + '/public'));

// Update the gis data
app.get('/update', function(req, res) {
    var qs = require("querystring");
    var http = require("http");

    var options = {
        "method": "POST",
        "hostname": "services6.arcgis.com",
        "port": null,
        "path": "/3R3y1KXaPJ9BFnsU/arcgis/rest/services/ServiceOrdersUpdate6/FeatureServer/0/updateFeatures",
        "headers": {
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "98382832-97e4-11da-590a-a4450b266223"
        }
    };

    var req = http.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on("end", function() {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write(qs.stringify({
        features: '[{ "attributes": { "OBJECTID": 145, "FID": 5258, "LOG_DATE": null, "LOCAT_DESC": "This is just a test", "REMARKS": " ", "LEAK_STATUS": "rep" }, "geometry": { "x": -76.7386527749252, "y": 17.9932317466246 } }]',
        token: 'XnsPROAxDN6v3tlvGvwvrA_YK8w3EU1Ga-36pQgrNMv9IjH8eS9BmSPL9W2xYalk27IuULwlMKkT3Vx_8KLtauu4f8krs7BcRZJsaVaN48OefBgs93__fk8yGZgcP5LBkLzyfKOSSNNYKo4FwpMmkSA_2Tq3Iy9HSxEzPvqXaPREfCJw7L_NBhBWdpVQR37J',
        f: 'json'
    }));
    res.send("The GIS was updated");
    req.end();
});
// Update the gis data
app.get('/parse', function(req, res) {
    var fs = require('fs');
    var obj;
    var jsonGis = new Array();
    var jsonArray;
    fs.readFile('pronto.json', 'utf8', function(err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        // console.log(obj.pages[8].answers[0].label);
        var val1 = obj.pages[8].answers[0].label;
        jsonGis.push(val1);
        var val2 = obj.pages[8].answers[0].values[0];
        jsonGis.push(val2);
        var val3 = obj.pages[8].answers[3].label;
        jsonGis.push(val3);
        var val4 = obj.pages[8].answers[3].values[0];
        jsonGis.push(val4);
        var val5 = obj.pages[8].answers[4].label;
        jsonGis.push(val5);
        var val6 = obj.pages[8].answers[4].values[0];
        jsonGis.push(val6);
        var val7 = obj.pages[8].answers[5].label;
        jsonGis.push(val7);
        var val8 = obj.pages[8].answers[5].values[0];
        jsonGis.push(val8);
        var val9 = obj.pages[8].answers[6].label;
        jsonGis.push(val9);
        var val10 = obj.pages[8].answers[6].values[0];
        jsonGis.push(val10);
        var val11 = obj.pages[8].answers[7].label;
        jsonGis.push(val11);
        var val12 = obj.pages[8].answers[7].values[0];
        jsonGis.push(val12);
        var val13 = obj.pages[8].answers[8].label;
        jsonGis.push(val13);
        var val14 = obj.pages[8].answers[8].values[0];
        jsonGis.push(val14);
        var val15 = obj.pages[8].answers[9].label;
        jsonGis.push(val15);
        var val16 = obj.pages[8].answers[9].values[0];
        jsonGis.push(val16);
        console.log(jsonGis);
        // jsonArray = JSON.parse(JSON.stringify(jsonGis));
        // console.log("starting here");
        // console.log(jsonArray);
    });
});

// Connecting to google API
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});
