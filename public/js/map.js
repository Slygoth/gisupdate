function initialize() {
    var currentinfo = null;
    var name = [];
    var iconcm = ["icons/cmred.png", "icons/cmyellow.png", "icons/cmblue.png"];
    var icondw = ["icons/dwred.png", "icons/dwyellow.png", "icons/dwblue.png"];
    var iconfs = ["icons/fsred.png", "icons/fsyellow.png", "icons/fsblue.png"];
    var iconmb = ["icons/mbred.png", "icons/mbyellow.png", "icons/mbblue.png"];
    var iconrr = ["icons/rrred.png", "icons/rryellow.png", "icons/rrblue.png"];
    var icontw = ["icons/twred.png", "icons/twyellow.png", "icons/twblue.png"];
    var iconst = ["icons/stred.png", "icons/styellow.png", "icons/stblue.png"];

    var mapOptions = {
        center: new google.maps.LatLng(18.0234382, -76.7841638),
        zoom: 14,
        mapTypeId: 'roadmap'
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    $.getJSON('https://services6.arcgis.com/3R3y1KXaPJ9BFnsU/arcgis/rest/services/ServiceOrdersUpdate8/FeatureServer/0/query?where=objectid%3E0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=Ucn6-fjxGDqF7Iz9_y3GRyqNyRp0Y0OF3R6EiMsjkSd2_5r0Wbo6pMVK8PnWeu85ESlzO4acpBg2LP5ZeovLs7KJUFZkTLDwGAt9CYmAJMVUgyLY0xgli7ocYMU21h2RHIA0G9t2PA4ny8hzcbikA51Hc6uqKYbTsHk9EYzQOnEiuc20cB4qgbteAQfeQpNn3cvKVTebrkMGxuXbzI0qYg6Uz4Yxec-82CCkUEWI6HM', function(data) {
        $.each(data.features, function(i, value) {
            if (JSON.stringify(data.features[i].properties.LEAK_STATUS) === '"exi"') {
                if (data.features[i].properties.Assigned_To !== null) {
                    if (JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"VLVL"' || JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"BPIP"' || JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"BPIM"') {
                        name.push(data.features[i].properties.LOCAT_DESC, i);
                        var contentString = '<div id="iw-container">' +
                        '<div class="iw-content">' +
                        '<div class="iw-subTitle">Location</div>' + data.features[i].properties.LOCAT_DESC + '<div class="iw-subTitle">Object id</div>' + data.features[i].properties.OBJECTID + '</div>' + '<div class="iw-subTitle">Code</div>' + data.features[i].properties.CODE + '</div>' + '<div class="iw-bottom-gradient"></div>' + '<button type="buttton" onclick="myFunction( \'' + data.features[i].properties.LOCAT_DESC + '\' )">Open Maps</button>' + '<button type="buttton" onclick="dispatch( \'' + data.features[i].properties.OBJECTID + '\' , \'' + data.features[i].properties.CODE + '\' , \'' + data.features[i].properties.LOCAT_DESC + '\', \'' + data.features[i].properties.Assigned_To + '\')">Dispatch</button>' + '</div>';
                        var infowindow = new google.maps.InfoWindow({content: contentString});
                        var useIcon;
                        if (JSON.stringify(data.features[i].properties.Assigned_To) === '"CM"') {
                            useIcon = iconcm[0]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"DW"') {
                            useIcon = icondw[0]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"FS"') {
                            useIcon = iconfs[0]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"MB"') {
                            useIcon = iconmb[0]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"RR"') {
                            useIcon = iconrr[0]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"TW"') {
                            useIcon = icontw[0]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"ST') {
                            useIcon = iconst[0]
                        }
                        var coords = data.features[i].geometry.coordinates;
                        var myLatlng = new google.maps.LatLng(coords[1], coords[0]);
                        var marker = new google.maps.Marker({position: myLatlng, map: map, icon: useIcon});
                        marker.addListener('click', function() {
                            if (currentinfo) {
                                currentinfo.close();
                            }
                            infowindow.open(map, marker);
                            currentinfo = infowindow;
                        });
                    } else if (JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"LMTR"' || JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"SRVL"') {
                        var contentString = '<div id="iw-container">' +
                        '<div class="iw-content">' +
                        '<div class="iw-subTitle">Location</div>' + data.features[i].properties.LOCAT_DESC + '<div class="iw-subTitle">Object id</div>' + data.features[i].properties.OBJECTID + '</div>' + '<div class="iw-subTitle">Code</div>' + data.features[i].properties.CODE + '</div>' + '<div class="iw-bottom-gradient"></div>' + '<button type="buttton" onclick="myFunction( \'' + name[0] + '\' )">Open Maps</button>' + '<button type="buttton" onclick="dispatch( \'' + data.features[i].properties.OBJECTID + '\' , \'' + data.features[i].properties.CODE + '\' , \'' + data.features[i].properties.LOCAT_DESC + '\', \'' + data.features[i].properties.Assigned_To + '\')">Dispatch</button>' + '</div>';

                        var infowindow = new google.maps.InfoWindow({content: contentString});
                        var useIcon;
                        if (JSON.stringify(data.features[i].properties.Assigned_To) === '"CM"') {
                            useIcon = iconcm[1]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"DW"') {
                            useIcon = icondw[1]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"FS"') {
                            useIcon = iconfs[1]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"MB"') {
                            useIcon = iconmb[1]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"RR"') {
                            useIcon = iconrr[1]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"TW"') {
                            useIcon = icontw[1]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"ST') {
                            useIcon = iconst[0]
                        }
                        var coords = data.features[i].geometry.coordinates;
                        var myLatlng = new google.maps.LatLng(coords[1], coords[0]);
                        var marker = new google.maps.Marker({position: myLatlng, map: map, icon: useIcon});
                        marker.addListener('click', function() {
                            if (currentinfo) {
                                currentinfo.close();
                            }
                            infowindow.open(map, marker);
                            currentinfo = infowindow;
                        });
                    } else if (JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"CUSL"' || JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"OTHER"' || JSON.stringify(data.features[i].properties.LEAK_LOCATION) === '"HYDR"') {
                        var contentString = '<div id="iw-container">' +
                        '<div class="iw-content">' +
                        '<div class="iw-subTitle">Location</div>' + data.features[i].properties.LOCAT_DESC + '<div class="iw-subTitle">Object id</div>' + data.features[i].properties.OBJECTID + '</div>' + '<div class="iw-subTitle">Code</div>' + data.features[i].properties.CODE + '</div>' + '<div class="iw-bottom-gradient"></div>' + '<button type="buttton" onclick="myFunction( \'' + name[0] + '\' )">Open Maps</button>' + '<button type="buttton" onclick="dispatch( \'' + data.features[i].properties.OBJECTID + '\' , \'' + data.features[i].properties.CODE + '\' , \'' + data.features[i].properties.LOCAT_DESC + '\', \'' + data.features[i].properties.Assigned_To + '\')">Dispatch</button>' + '</div>';

                        var infowindow = new google.maps.InfoWindow({content: contentString});
                        var useIcon;
                        if (JSON.stringify(data.features[i].properties.Assigned_To) === '"CM"') {
                            useIcon = iconcm[2]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"DW"') {
                            useIcon = icondw[2]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"FS"') {
                            useIcon = iconfs[2]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"MB"') {
                            useIcon = iconmb[2]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"RR"') {
                            useIcon = iconrr[2]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"TW"') {
                            useIcon = icontw[2]
                        } else if (JSON.stringify(data.features[i].properties.Assigned_To) === '"ST') {
                            useIcon = iconst[0]
                        }
                        var coords = data.features[i].geometry.coordinates;
                        var myLatlng = new google.maps.LatLng(coords[1], coords[0]);
                        var marker = new google.maps.Marker({position: myLatlng, map: map, icon: useIcon});
                        marker.addListener('click', function() {
                            if (currentinfo) {
                                currentinfo.close();
                            }
                            infowindow.open(map, marker);
                            currentinfo = infowindow;
                        });
                    }
                }
            }
        });
    });
}
function dispatch(object, code, address, user) {
    var userid;
    if (user == "CM") {
        userid = 133040042
    } else if (user == "RR") {
        userid = 133042082
    } else if (user == "FS") {
        userid = 132984131
    } else if (user == "MB") {
        userid = 133040041
    } else if (user == "DW") {
        userid = 133040038
    } else if (user == "TW") {
        userid = 133042079
    } else if (user == "ST") {
        userid = 132951107
    }
    new Image().src = "https://gisupdate.herokuapp.com/pronto?object=" + object + "&code=" + code + "&address=" + address + "&userid=" + userid;
    // new Image().src = "http://localhost:3000/pronto?object=" + object + "&code=" + code + "&address=" + address + "&userid=" + userid;
}

function myFunction(address) {
    var win = window.open('https://maps.google.com/?daddr=' + address + ',Kingston,Jamaica&saddr=current%20location');
    // win.focus();
}
