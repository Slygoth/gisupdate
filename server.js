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
        "path": "/3R3y1KXaPJ9BFnsU/arcgis/rest/services/ProntoFormsTest/FeatureServer/0/updateFeatures",
        "headers": {
            "accept": "application/json",
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "dc3ea736-e6b7-3f10-c1b9-cbc6e1a783c2"
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
    var testing = '[{ "attributes": { "OBJECTID": 145, "FID": 5258, "LOG_DATE": null, "LOCAT_DESC": "This is just a test", "REMARKS": " ", "LEAK_STATUS": "rep" }, "geometry": { "x": -76.7386527749252, "y": 17.9932317466246 } }]';
    console.log("This is for update");
    console.log(testing);
    req.write(qs.stringify({features: testing, token: 'KCGXGNiEtNE6BQfPM0Zem9J3jN78oNLbIBFmQ09LsWtpl1ZV3__zs7djJulkOz-EnPZC7eqyJgCNqeEQ-Xoixitp5c1hOzUKV4p0Pxvg17TL-xYLvAxzxLU6gAPSLIMDvccHm-dk231fiYJw9gWRXe_vHHcxs9RGRXTCQ2_V1o9bWvdADe88pwgvhmqOg5fv', f: 'json'}));
    res.send("The GIS was updated");
    req.end();
});
app.get('/pronto', function(req, res) {
    var object = req.param('object');
    var code = req.param('code');
    var http = require("https");
    var options = {
        "method": "POST",
        "hostname": "api.prontoforms.com",
        "port": null,
        "path": "/api/1/data/dispatch.xml",
        "headers": {
            "authorization": "Basic YTIxNDEyNDQwMDE6RzJwbjEzU2p4dlRPWENDN051a2U1SG1rMHdidzlCMUw1cUdSeEJ0OXc4aW1vWmgvZndGandsRGhpYm8vSk14dA==",
            "cache-control": "no-cache",
            "postman-token": "866ddfb3-b5aa-46a8-3fb9-267920c64494"
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
    req.write('<dispatch>\n<formId>144582101</formId>\n<userId>132951107</userId>\n<data>\n  <answer label=\"address\">' + address + '</answer>\n <answer label=\"Code\">' + code + '</answer>\n  <answer label=\"object\">' + object + '</answer>\n</data>\n</dispatch>');
    req.end();
});
app.get('/parse', function(req, res) {
    var fs = require('fs');
    var obj;
    var jsonGis = new Array();
    var jsonArray;
    fs.readFile('pronto.json', 'utf8', function(err, data) {
        if (err)
            throw err;
        obj = JSON.parse(data);
        jsonGis.push('"attributes":{');
        jsonGis.push('"OBJECTID":1159,');
        jsonGis.push('"LEAK_STATUS"');
        if (obj.pages[1].answers[7].values[0] == "Duplicate") {
            jsonGis.push('"other"');
        }
        if (obj.pages[1].answers[7].values[0] == "No further action (customer side leak)") {
            jsonGis.push('"other"');
        }
        if (obj.pages[1].answers[7].values[0] == "No further action (Hydrant valve leak)") {
            jsonGis.push('"other"');
        }
        if (obj.pages[1].answers[7].values[0] == "Sewerage") {
            jsonGis.push('"other"');
        }
        if (obj.pages[1].answers[7].values[0] == "Leak found") {
            jsonGis.push('"rep"');
        }
        if (obj.pages[1].answers[7].values[0] == "Found repaired") {
            jsonGis.push('"rep"');
        }
        jsonGis.push('"PIPE_DIAM"');
        jsonGis.push('"' + obj.pages[5].answers[4].values[0] + '"');
        jsonGis.push('"PIPE_MATERIAL"');
        if (obj.pages[5].answers[3].values[0] != "undefined") {
            jsonGis.push('"' + obj.pages[5].answers[3].values[0] + '"');
        } else {
            jsonGis.push('"' + obj.pages[6].answers[4].values[0] + '"');
        }
        jsonGis.push('"REPAIRED_BY"');
        jsonGis.push('"' + obj.pages[1].answers[2].values[0] + '"');
        jsonGis.push('"COMPLETED_DATE"');
        jsonGis.push('"' + obj.pages[1].answers[0].values[0] + '"');
        jsonGis.push('"CODE"');
        jsonGis.push('"16MNCSD5258"');
        jsonGis.push('"geometry":{');
        jsonGis.push('"x":' + obj.pages[1].answers[4].values[0].coordinates.latitude + ',');
        jsonGis.push('"y":' + obj.pages[1].answers[4].values[0].coordinates.longitude);
        var str = "[{ " + jsonGis[0] + jsonGis[1] + jsonGis[2] + ": " + jsonGis[3] + "," + jsonGis[4] + ": " + jsonGis[5] + "," + jsonGis[6] + ": " + jsonGis[7] + "," + jsonGis[8] + ": " + jsonGis[9] + "," + jsonGis[10] + ": " + jsonGis[11] + "," + jsonGis[12] + ": " + jsonGis[13] + " }," + jsonGis[14] + " " + jsonGis[15] + " " + jsonGis[16] + "}}]"
        //pushing to the GIS
        console.log("check here");
        console.log(str);
        var qs = require("querystring");
        var http = require("http");
        var options = {
            "method": "POST",
            "hostname": "services6.arcgis.com",
            "port": null,
            "path": "/3R3y1KXaPJ9BFnsU/arcgis/rest/services/ProntoFormsTest/FeatureServer/0/updateFeatures",
            "headers": {
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache",
                "postman-token": "dc3ea736-e6b7-3f10-c1b9-cbc6e1a783c2"
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
        var testing = '[{ "attributes": { "OBJECTID": 1580, "FID": 5258, "LOG_DATE": null, "LOCAT_DESC" : "uhgjvhfdrtdfyvygfytf", "REMARKS": " ", "LEAK_STATUS": "rep" }, "geometry": { "x": -76.7386527749252, "y": 17.9932317466246 } }]';
        console.log("This is for testing");
        console.log(testing);
        console.log("This is for str");
        console.log(str);
        req.write(qs.stringify({features: str, token: 'KCGXGNiEtNE6BQfPM0Zem9J3jN78oNLbIBFmQ09LsWtpl1ZV3__zs7djJulkOz-EnPZC7eqyJgCNqeEQ-Xoixitp5c1hOzUKV4p0Pxvg17TL-xYLvAxzxLU6gAPSLIMDvccHm-dk231fiYJw9gWRXe_vHHcxs9RGRXTCQ2_V1o9bWvdADe88pwgvhmqOg5fv', f: 'json'}));
        res.send("The GIS was updated");
        req.end();
    });
});

// Connecting to google API
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});
