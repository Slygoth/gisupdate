var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('MIYA ROOT API');
})

app.use(express.static(__dirname + '/public'));

app.get('/pronto', function(req, res) {
    var address = req.param('address');
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
    req.write('<dispatch>\n<formId>144582101</formId>\n<userId>132951107</userId>\n<data>\n  <answer label=\"address\">' + address + '</answer>\n <answer label=\"code\">' + code + '</answer>\n  <answer label=\"object\">' + object + '</answer>\n</data>\n</dispatch>');
    req.end();
});

app.get('/parse', function(req, res) {
    var fs = require('fs');
    var filePaths = [];
    const downloadFolder = './download/';
    fs.readdir(downloadFolder, (err, files) => {
        files.forEach(file => {
            filePaths.push("download/" + file);
        });
        finish(filePaths);
    })
});
app.get('/download', function(req, res) {
    var fs = require('fs');
    var path = require('path');
    var readline = require('readline');
    var google = require('googleapis');
    var googleAuth = require('google-auth-library');

    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/drive-nodejs-quickstart.json
    var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly', 'https://www.googleapis.com/auth/drive'];
    var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
    var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Drive API.
        authorize(JSON.parse(content), listFiles);
    });

    /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   *
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
    function authorize(credentials, callback) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({access_type: 'offline', scope: SCOPES[1]});
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({input: process.stdin, output: process.stdout});
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }

    /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
    function storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }

    /**
   * Lists the names and IDs of up to 10 files.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
    function listFiles(auth) {
        var service = google.drive('v3');
        service.files.list({
            auth: auth,
            pageSize: 10,
            fields: "nextPageToken, files(id, name)"
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var files = response.files;
            if (files.length == 0) {
                console.log('No files found.');
            } else {
                console.log('Files:');
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var fileId = file.id;
                    console.log('%s', file.name);

                    file = fs.createWriteStream(path.join("download", file.name));

                    // Download file
                    service.files.get({auth: auth, fileId: fileId, alt: "media"}).pipe(file);
                }
            }
        });
    }

});

//Parsing pronto data
function finish(filePaths) {
    var fs = require('fs');
    var obj;
    filePaths.forEach(function(file) {
        fs.readFile(file, function(err, data) {
            var jsonGis = new Array();
            if (err)
                throw err;
            obj = JSON.parse(data);
            jsonGis.push('"attributes":{');
            jsonGis.push('"OBJECTID":' + obj.pages[0].answers[2].values[0] + ',');
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
            if (obj.pages[5].answers[4].values[0] == "undefined") {
                jsonGis.push('"' + obj.pages[6].answers[3].values[0] + '"');
            } else {
                jsonGis.push('"' + obj.pages[5].answers[4].values[0] + '"');
            }
            jsonGis.push('"PIPE_MATERIAL"');
            if (obj.pages[5].answers[3].values[0] == "undefined") {
                jsonGis.push('"' + obj.pages[6].answers[4].values[0] + '"');
            } else {
                jsonGis.push('"' + obj.pages[5].answers[3].values[0] + '"');
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
            var str = "[{ " + jsonGis[0] + jsonGis[1] + jsonGis[2] + ": " + jsonGis[3] + "," + jsonGis[4] + ": " + jsonGis[5] + "," + jsonGis[6] + ": " + jsonGis[7] + "," + jsonGis[8] + ": " + jsonGis[9] + "," + jsonGis[10] + ": " + jsonGis[11] + "," + jsonGis[12] + ": " + jsonGis[13] + " }," + jsonGis[14] + " " + jsonGis[15] + " " + jsonGis[16] + "}}]";
            console.log(str);
            gisupdate(str);
        });
    })
}
//Updating GIS
function gisupdate(str) {
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
    }
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
    req.write(qs.stringify({features: str, token: 'KCGXGNiEtNE6BQfPM0Zem9J3jN78oNLbIBFmQ09LsWtpl1ZV3__zs7djJulkOz-EnPZC7eqyJgCNqeEQ-Xoixitp5c1hOzUKV4p0Pxvg17TL-xYLvAxzxLU6gAPSLIMDvccHm-dk231fiYJw9gWRXe_vHHcxs9RGRXTCQ2_V1o9bWvdADe88pwgvhmqOg5fv', f: 'json'}));
    // res.send("The GIS was updated");
    req.end();
}

// Connecting to google API
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});
