var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var filearray = [];
var app = express();
var PORT = process.env.PORT || 3000

app.use(bodyParser.json());

app.get('/', function(req, res) {
    var path = require('path');
    res.sendFile('public/map.html', {root: __dirname});
})

app.use(express.static(__dirname + '/public'));

app.get('/pronto', function(req, res) {
    var address = req.param('address');
    var object = req.param('object');
    var code = req.param('code');
    var userid = req.param('userid');
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
    // req.write('<dispatch>\n<formId>144582101</formId>\n<userId>132951107</userId>\n<data>\n  <answer label=\"address\">' + address + '</answer>\n <answer label=\"code\">' + code + '</answer>\n  <answer label=\"object\">' + object + '</answer>\n</data>\n</dispatch>');
    req.write('<dispatch>\n<formId>144582101</formId>\n<userId>' + userid + '</userId>\n<data>\n  <answer label=\"address\">' + address + '</answer>\n <answer label=\"code\">' + code + '</answer>\n  <answer label=\"object\">' + object + '</answer>\n</data>\n</dispatch>');
    req.end();
});

app.get('/download', function(req, res) {
    var minutes = 1,
        the_interval = minutes * 10000;
    // setInterval(function() {
        console.log("I am doing my 5 minutes check");
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
                pageSize: 1000,
                q: "mimeType='application/json'",
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
                        // console.log('%s (%s)', file.name, file.id);
                        filearray.push("https://drive.google.com/uc?export=view&id=" + file.id);
                    }
                }
            });
        }
        setTimeout(function(req, res) {
            finish(filearray);
        }, 2000);
    // }, the_interval);
});

//Parsing pronto data
function finish(filearray) {
    var fs = require('fs');
    var obj;
    filearray.forEach(function(file) {
        var request = require('request');
        var url = file;
        // inven(url);
        request({
            url: url,
            json: true
        }, function(error, response, obj) {
            var jsonGis = new Array();
            // console.log(obj.user.username);
            // console.log(obj.deviceSubmitDate.time);
            jsonGis.push('"attributes":{');
            if (obj.pages[0].answers[2].values[0] != undefined) {
                jsonGis.push('"OBJECTID":' + obj.pages[0].answers[2].values[0] + ',');
            } else {
                jsonGis.push("");
            }
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
            if (obj.pages[5].answers[4].values[0] != undefined) {
                jsonGis.push('"' + 0 + '"');
                // jsonGis.push('"' + obj.pages[5].answers[5].values[0] + '"');
            } else if (obj.pages[6].answers[4].values[0] != undefined) {
                jsonGis.push('"' + 0 + '"');
                // jsonGis.push('"' + obj.pages[6].answers[5].values[0] + '"');
            } else if (obj.pages[37].answers[6].values[0] != undefined){
                jsonGis.push('"' + 0 + '"');
                // jsonGis.push('"' + obj.pages[37].answers[7].values[0] + '"');
            } else {
              jsonGis.push('"' + 0 + '"')
            }
            jsonGis.push('"PIPE_MATERIAL"');
            if (obj.pages[5].answers[3].values[0] != undefined) {
                jsonGis.push('"' + obj.pages[5].answers[3].values[0] + '"');
            } else if (obj.pages[6].answers[4].values[0] != undefined) {
                jsonGis.push('"' + obj.pages[6].answers[4].values[0] + '"');
            } else {
                jsonGis.push('"' + obj.pages[37].answers[5].values[0] + '"');
            }
            jsonGis.push('"REPAIRED_BY"');
            jsonGis.push('"' + obj.pages[1].answers[2].values[0] + '"');
            jsonGis.push('"COMPLETED_DATE"');
            jsonGis.push('"' + obj.pages[1].answers[0].values[0].provided.time + '"');
            jsonGis.push('"CODE"');
            jsonGis.push('""');
            jsonGis.push('"geometry":{');
            jsonGis.push('"x":' + -76.566682 + ',');
            // jsonGis.push('"x":' + obj.pages[1].answers[4].values[0].coordinates.longitude + ',');
            jsonGis.push('"y":' + 17.645106);
            // jsonGis.push('"y":' + obj.pages[1].answers[4].values[0].coordinates.latitude);
            jsonGis.push(',"spatialReference":{"wkid":4326}');
            var str = "[{ " + jsonGis[0] + jsonGis[1] + jsonGis[2] + ": " + jsonGis[3] + "," + jsonGis[4] + ": " + jsonGis[5] + "," + jsonGis[6] + ": " + jsonGis[7] + "," + jsonGis[8] + ": " + jsonGis[9] + "," + jsonGis[10] + ": " + jsonGis[11] + "," + jsonGis[12] + ": " + jsonGis[13] + " }," + jsonGis[14] + " " + jsonGis[15] + " " + jsonGis[16] + " " + jsonGis[17] + "}}]";
            console.log(str);
            addfeature(str);
            // gisupdate(str);
        })
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
      "postman-token": "527c11b9-0097-4c0c-42a5-46fe91a60ff7"
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
    req.write(qs.stringify({features: str, token: 'O8B5WLB2nABQ9SFQZSEw7OhVPk2il8daNejNOXInCxJbW3769jy6wOtI5zv0x44sTtO3-fK4NGsmZrbS4I0ZJHAHwpHd9Zlp2rOzFG7GkzzaphWQCddQaPNmInBCXHmYXlXqzONBzGphfHKacTLkLiY5d0jLJJBEpnNH2ja3uECF1EQfIAM1nLfqGB45YvhX7xoR4gYU_7vpVUZc0baCfNWKaJgC0EAtPPVtcAsBhaU', f: 'json'}));
    // res.send("The GIS was updated");
    req.end();
}
//adding feature GIS
function addfeature(str) {
  var qs = require("querystring");
  var http = require("http");

  var options = {
    "method": "POST",
    "hostname": "services6.arcgis.com",
    "port": null,
    "path": "/3R3y1KXaPJ9BFnsU/arcgis/rest/services/ProntoFormsTest/FeatureServer/0/addFeatures",
    "headers": {
      "accept": "application/json",
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      "postman-token": "527c11b9-0097-4c0c-42a5-46fe91a60ff7"
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

    req.write(qs.stringify({features: str, token: 'O8B5WLB2nABQ9SFQZSEw7OhVPk2il8daNejNOXInCxJbW3769jy6wOtI5zv0x44sTtO3-fK4NGsmZrbS4I0ZJHAHwpHd9Zlp2rOzFG7GkzzaphWQCddQaPNmInBCXHmYXlXqzONBzGphfHKacTLkLiY5d0jLJJBEpnNH2ja3uECF1EQfIAM1nLfqGB45YvhX7xoR4gYU_7vpVUZc0baCfNWKaJgC0EAtPPVtcAsBhaU', f: 'json'}));
    req.end();
}
//inventory list
function inven(urll) {
    var request = require('request');
    var excelbuilder = require('msexcel-builder');
    // var url = "http://nicolauslawson.com/pronto.json";
    var fs = require('fs');
    request({
        url: urll,
        json: true
    }, function(error, response, obj) {
        var inven = new Array();
        var user = obj.user.username;
        var form = obj.form.name;
        var version = obj.form.version;
        var submitDate = obj.deviceSubmitDate.time;
        var startDate = obj.pages[1].answers[0].values[0].provided.time;
        inven.push("User");
        inven.push(user);
        inven.push("\nForm Name");
        inven.push(form);
        inven.push("\nVersion");
        inven.push(version);
        inven.push("\nStart Date");
        inven.push(startDate);
        inven.push("\nSubmit Date");
        inven.push(submitDate);
        inven.push("\n\n\nName");
        inven.push("Type");
        inven.push("Description");
        inven.push("Quantity");
        inven.push("Length");
        //saddle 1
        var sname = obj.pages[39].name;
        var saddletype = obj.pages[39].answers[0].values[0];
        var sdesc = obj.pages[39].answers[1].values[0];
        var squantity = obj.pages[39].answers[2].values[0];
        if (obj.pages[39].answers[0].values[0] != undefined) {
            inven.push('\n' + sname);
            inven.push(saddletype);
            inven.push(sdesc);
            inven.push(squantity);
        }
        //saddle 2
        var sname = obj.pages[40].name;
        var saddletype = obj.pages[40].answers[0].values[0];
        var sdesc = obj.pages[40].answers[1].values[0];
        var squantity = obj.pages[40].answers[2].values[0];
        if (obj.pages[40].answers[0].values[0] != undefined) {
            inven.push('\n' + sname);
            inven.push(saddletype);
            inven.push(sdesc);
            inven.push(squantity);
        }
        //saddle 3
        var sname = obj.pages[41].name;
        var saddletype = obj.pages[41].answers[0].values[0];
        var sdesc = obj.pages[41].answers[1].values[0];
        var squantity = obj.pages[41].answers[2].values[0];
        if (obj.pages[41].answers[0].values[0] != undefined) {
            inven.push('\n' + sname);
            inven.push(saddletype);
            inven.push(sdesc);
            inven.push(squantity);
        }
        //Ball Valve 1
        var sname = obj.pages[42].name;
        var ballvalvetype = obj.pages[42].answers[0].values[0];
        var bdesc = obj.pages[42].answers[1].values[0];
        var bquantity = obj.pages[42].answers[2].values[0];
        if (obj.pages[42].answers[0].values[0] != undefined) {
            inven.push('\n' + sname);
            inven.push(ballvalvetype);
            inven.push(bdesc);
            inven.push(bquantity);
        }
        //Ball Valve 2
        var sname = obj.pages[43].name;
        var ballvalvetype = obj.pages[43].answers[0].values[0];
        var bdesc = obj.pages[43].answers[1].values[0];
        var bquantity = obj.pages[43].answers[2].values[0];
        if (obj.pages[43].answers[0].values[0] != undefined) {
            inven.push('\n' + sname);
            inven.push(ballvalvetype);
            inven.push(bdesc);
            inven.push(bquantity);
        }
        //Ball Valve 3
        var bname = obj.pages[44].name;
        var ballvalvetype = obj.pages[44].answers[0].values[0];
        var bdesc = obj.pages[44].answers[1].values[0];
        var bquantity = obj.pages[44].answers[2].values[0];
        if (obj.pages[44].answers[0].values[0] != undefined) {
            inven.push('\n' + sname);
            inven.push(ballvalvetype);
            inven.push(bdesc);
            inven.push(bquantity);
        }
        //Elbow 90 1
        var ename = obj.pages[45].name;
        var elbowtype = obj.pages[45].answers[0].values[0];
        var edesc = obj.pages[45].answers[1].values[0];
        var equantity = obj.pages[45].answers[2].values[0];
        if (obj.pages[45].answers[0].values[0] != undefined) {
            inven.push('\n' + ename);
            inven.push(elbowtype);
            inven.push(edesc);
            inven.push(equantity);
        }
        //Elbow 90 2
        var ename = obj.pages[46].name;
        var elbowtype = obj.pages[46].answers[0].values[0];
        var edesc = obj.pages[46].answers[1].values[0];
        var equantity = obj.pages[46].answers[2].values[0];
        if (obj.pages[46].answers[0].values[0] != undefined) {
            inven.push('\n' + ename);
            inven.push(elbowtype);
            inven.push(edesc);
            inven.push(equantity);
        }
        //Elbow 90 2
        var ename = obj.pages[47].name;
        var elbowtype = obj.pages[47].answers[0].values[0];
        var edesc = obj.pages[47].answers[1].values[0];
        var equantity = obj.pages[47].answers[2].values[0];
        if (elbowtype = obj.pages[47].answers[0].values[0] != undefined) {
            inven.push('\n' + ename);
            inven.push(elbowtype);
            inven.push(edesc);
            inven.push(equantity);
        }
        //ISIFLO 1
        var iname = obj.pages[48].name;
        var isisflotype = obj.pages[48].answers[0].values[0];
        var idesc = obj.pages[48].answers[1].values[0];
        var iquantity = obj.pages[48].answers[2].values[0];
        if (obj.pages[48].answers[0].values[0] != undefined) {
            inven.push('\n' + iname);
            inven.push(isisflotype);
            inven.push(idesc);
            inven.push(iquantity);
        }
        //ISIFLO 2
        var iname = obj.pages[49].name;
        var isisflotype = obj.pages[49].answers[0].values[0];
        var idesc = obj.pages[49].answers[1].values[0];
        var iquantity = obj.pages[49].answers[2].values[0];
        if (obj.pages[49].answers[0].values[0] != undefined) {
            inven.push('\n' + iname);
            inven.push(isisflotype);
            inven.push(idesc);
            inven.push(iquantity);
        }
        //ISIFLO 3
        var iname = obj.pages[50].name;
        var isisflotype = obj.pages[50].answers[0].values[0];
        var idesc = obj.pages[50].answers[1].values[0];
        var iquantity = obj.pages[50].answers[2].values[0];
        if (obj.pages[50].answers[0].values[0] != undefined) {
            inven.push('\n' + iname);
            inven.push(isisflotype);
            inven.push(idesc);
            inven.push(iquantity);
        }
        //ISIFLO Elbow 1
        var iname = obj.pages[51].name;
        var isisflotype = obj.pages[51].answers[0].values[0];
        var idesc = obj.pages[51].answers[1].values[0];
        var iquantity = obj.pages[51].answers[2].values[0];
        if (obj.pages[51].answers[0].values[0] != undefined) {
            inven.push('\n' + iname);
            inven.push(isisflotype);
            inven.push(idesc);
            inven.push(iquantity);
        }
        //ISIFLO Elbow 2
        var iname = obj.pages[52].name;
        var isisflotype = obj.pages[52].answers[0].values[0];
        var idesc = obj.pages[52].answers[1].values[0];
        var iquantity = obj.pages[52].answers[2].values[0];
        if (obj.pages[52].answers[0].values[0] != undefined) {
            inven.push('\n' + iname);
            inven.push(isisflotype);
            inven.push(idesc);
            inven.push(iquantity);
        }
        //ISIFLO Elbow 3
        var iname = obj.pages[53].name;
        var isisflotype = obj.pages[53].answers[0].values[0];
        var idesc = obj.pages[53].answers[1].values[0];
        var iquantity = obj.pages[53].answers[2].values[0];
        if (obj.pages[53].answers[0].values[0] != undefined) {
            inven.push('\n' + iname);
            inven.push(isisflotype);
            inven.push(idesc);
            inven.push(iquantity);
        }
        //insert for Pex 1
        var pname = obj.pages[54].name;
        var pextype = obj.pages[54].answers[0].values[0];
        var pdesc = obj.pages[54].answers[1].values[0];
        var pquantity = obj.pages[54].answers[2].values[0];
        if (obj.pages[54].answers[0].values[0] != undefined) {
            inven.push('\n' + pname);
            inven.push(pextype);
            inven.push(pdesc);
            inven.push(pquantity);
        }
        //insert for Pex 2
        var pname = obj.pages[55].name;
        var pextype = obj.pages[55].answers[0].values[0];
        var pdesc = obj.pages[55].answers[1].values[0];
        var pquantity = obj.pages[55].answers[2].values[0];
        if (obj.pages[55].answers[0].values[0] != undefined) {
            inven.push('\n' + pname);
            inven.push(pextype);
            inven.push(pdesc);
            inven.push(pquantity);
        }
        //insert for Pex 3
        var pname = obj.pages[56].name;
        var pextype = obj.pages[56].answers[0].values[0];
        var pdesc = obj.pages[56].answers[1].values[0];
        var pquantity = obj.pages[56].answers[2].values[0];
        if (obj.pages[56].answers[0].values[0] != undefined) {
            inven.push('\n' + pname);
            inven.push(pextype);
            inven.push(pdesc);
            inven.push(pquantity);
        }
        //Pex 1
        var pname = obj.pages[57].name;
        var pextype = obj.pages[57].answers[0].values[0];
        var pdesc = obj.pages[57].answers[1].values[0];
        var plength = obj.pages[57].answers[2].values[0];
        if (obj.pages[57].answers[0].values[0] != undefined) {
            inven.push('\n' + pname);
            inven.push(pextype);
            inven.push(pdesc);
            inven.push("");
            inven.push(plength);
        }
        //Pex 2
        var pname = obj.pages[58].name;
        var pextype = obj.pages[58].answers[0].values[0];
        var pdesc = obj.pages[58].answers[1].values[0];
        var plength = obj.pages[58].answers[2].values[0];
        if (obj.pages[58].answers[0].values[0] != undefined) {
            inven.push('\n' + pname);
            inven.push(pextype);
            inven.push(pdesc);
            inven.push("");
            inven.push(plength);
        }
        //Pex 3
        var pname = obj.pages[59].name;
        var pextype = obj.pages[59].answers[0].values[0];
        var pdesc = obj.pages[59].answers[1].values[0];
        var plength = obj.pages[59].answers[2].values[0];
        if (obj.pages[59].answers[0].values[0] != undefined) {
            inven.push('\n' + pname);
            inven.push(pextype);
            inven.push(pdesc);
            inven.push("");
            inven.push(plength);
        }
        //Meter value
        var name = obj.pages[60].name;
        var type = obj.pages[60].answers[0].values[0];
        var desc = obj.pages[60].answers[1].values[0];
        var quantity = obj.pages[60].answers[2].values[0];
        if (obj.pages[60].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Meter value
        var name = obj.pages[61].name;
        var type = obj.pages[61].answers[0].values[0];
        var desc = obj.pages[61].answers[1].values[0];
        var quantity = obj.pages[61].answers[2].values[0];
        if (obj.pages[61].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Meter value
        var name = obj.pages[62].name;
        var type = obj.pages[62].answers[0].values[0];
        var desc = obj.pages[62].answers[1].values[0];
        var quantity = obj.pages[62].answers[2].values[0];
        if (obj.pages[62].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Manifolds 1
        var name = obj.pages[63].name;
        var type = obj.pages[63].answers[0].values[0];
        var desc = obj.pages[63].answers[1].values[0];
        var quantity = obj.pages[63].answers[2].values[0];
        if (obj.pages[63].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Manifolds 2
        var name = obj.pages[64].name;
        var type = obj.pages[64].answers[0].values[0];
        var desc = obj.pages[64].answers[1].values[0];
        var quantity = obj.pages[64].answers[2].values[0];
        if (obj.pages[64].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Manifolds 3
        var name = obj.pages[65].name;
        var type = obj.pages[65].answers[0].values[0];
        var desc = obj.pages[65].answers[1].values[0];
        var quantity = obj.pages[65].answers[2].values[0];
        if (obj.pages[65].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Manifolds Caps 1
        var name = obj.pages[66].name;
        var type = obj.pages[66].answers[0].values[0];
        var desc = obj.pages[66].answers[1].values[0];
        var quantity = obj.pages[66].answers[2].values[0];
        if (obj.pages[66].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Manifolds Caps 2
        var name = obj.pages[67].name;
        var type = obj.pages[67].answers[0].values[0];
        var desc = obj.pages[67].answers[1].values[0];
        var quantity = obj.pages[67].answers[2].values[0];
        if (obj.pages[67].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Manifolds Caps 3
        var name = obj.pages[68].name;
        var type = obj.pages[68].answers[0].values[0];
        var desc = obj.pages[68].answers[1].values[0];
        var quantity = obj.pages[68].answers[2].values[0];
        if (obj.pages[68].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Clamps 1
        var name = obj.pages[69].name;
        var type = obj.pages[69].answers[0].values[0];
        var desc = obj.pages[69].answers[1].values[0];
        var quantity = obj.pages[69].answers[2].values[0];
        if (obj.pages[69].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Clamps 2
        var name = obj.pages[70].name;
        var type = obj.pages[70].answers[0].values[0];
        var desc = obj.pages[70].answers[1].values[0];
        var quantity = obj.pages[70].answers[2].values[0];
        if (obj.pages[70].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Clamps 3
        var name = obj.pages[71].name;
        var type = obj.pages[71].answers[0].values[0];
        var desc = obj.pages[71].answers[1].values[0];
        var quantity = obj.pages[71].answers[2].values[0];
        if (obj.pages[71].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Flex Adaptor 1
        var name = obj.pages[72].name;
        var type = obj.pages[72].answers[0].values[0];
        var desc = obj.pages[72].answers[1].values[0];
        var quantity = obj.pages[72].answers[2].values[0];
        if (obj.pages[72].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Flex Adaptor 2
        var name = obj.pages[73].name;
        var type = obj.pages[73].answers[0].values[0];
        var desc = obj.pages[73].answers[1].values[0];
        var quantity = obj.pages[73].answers[2].values[0];
        if (obj.pages[73].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Flex Adaptor 3
        var name = obj.pages[74].name;
        var type = obj.pages[74].answers[0].values[0];
        var desc = obj.pages[74].answers[1].values[0];
        var quantity = obj.pages[74].answers[2].values[0];
        if (obj.pages[74].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push(desc);
            inven.push(quantity);
        }
        //Detection Tape
        var name = obj.pages[75].name;
        var type = obj.pages[75].answers[0].values[0];
        var length = obj.pages[75].answers[2].values[0];
        if (obj.pages[75].answers[0].values[0] != undefined) {
            inven.push('\n' + name);
            inven.push(type);
            inven.push("");
            inven.push("");
            inven.push(length);
        }
        fs.writeFile('./inventory/' + inven[1] + inven[7] + '.csv', inven, 'utf8', function(err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                console.log('It\'s saved!');
            }
        });
    })
}
// Connecting to google API
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port ' + PORT + '!');
    });
});
