var request = require('request');
var excelbuilder = require('msexcel-builder');
var url = "http://nicolauslawson.com/pronto.json";
var fs = require('fs');
request({
    url: url,
    json: true
}, function(error, response, obj) {
    var inven = new Array();
    var user = obj.user.username;
    var form = obj.form.name;
    var version = obj.form.version;
    var submitDate = obj.deviceSubmitDate.time;
    var startDate = obj.pages[1].answers[0].values[0].provided.time;
    var workbook = excelbuilder.createWorkbook('./', 'sample.csv')
    var sheet1 = workbook.createSheet('sheet1', 50, 50);
    var i = 8
    inven.push("User");
    inven.push(user);
    sheet1.set(1, 1, inven[0]);
    sheet1.set(2, 1, inven[1]);
    inven.push("\nForm Name");
    inven.push(form);
    sheet1.set(1, 2, inven[2]);
    sheet1.set(2, 2, inven[3]);
    inven.push("\nVersion");
    inven.push(version);
    sheet1.set(1, 3, inven[4]);
    sheet1.set(2, 3, inven[5]);
    inven.push("\nStart Date");
    inven.push(startDate);
    sheet1.set(1, 4, inven[6]);
    sheet1.set(2, 4, inven[7]);
    inven.push("\nSubmit Date");
    inven.push(submitDate);
    sheet1.set(1, 5, inven[8]);
    sheet1.set(2, 5, inven[9]);
    inven.push("\n\n\nName");
    inven.push("Type");
    inven.push("Description");
    inven.push("Quantity");
    inven.push("Length");
    sheet1.set(1, 7, inven[10]);
    sheet1.set(2, 7, inven[11]);
    sheet1.set(3, 7, inven[12]);
    sheet1.set(4, 7, inven[13]);
    sheet1.set(5, 7, inven[14]);
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
        sheet1.set(1, i, sname);
        sheet1.set(2, i, saddletype);
        sheet1.set(3, i, sdesc);
        sheet1.set(4, i, 453);
        i++;
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
        sheet1.set(1, i, sname);
        sheet1.set(2, i, saddletype);
        sheet1.set(3, i, sdesc);
        sheet1.set(4, i, parseInt(squantity));
        i++;
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
        sheet1.set(1, i, sname);
        sheet1.set(2, i, saddletype);
        sheet1.set(3, i, sdesc);
        sheet1.set(4, i, parseInt(squantity));
        i++;
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
        sheet1.set(1, i, sname);
        sheet1.set(2, i, ballvalvetype);
        sheet1.set(3, i, bdesc);
        sheet1.set(4, i, bquantity);
        i++;
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
        sheet1.set(1, i, sname);
        sheet1.set(2, i, ballvalvetype);
        sheet1.set(3, i, bdesc);
        sheet1.set(4, i, bquantity);
        i++;
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
        sheet1.set(1, i, bname);
        sheet1.set(2, i, ballvalvetype);
        sheet1.set(3, i, bdesc);
        sheet1.set(4, i, bquantity);
        i++;
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
        sheet1.set(1, i, ename);
        sheet1.set(2, i, elbowtype);
        sheet1.set(3, i, edesc);
        sheet1.set(4, i, equantity);
        i++;
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
        sheet1.set(1, i, ename);
        sheet1.set(2, i, elbowtype);
        sheet1.set(3, i, edesc);
        sheet1.set(4, i, equantity);
        i++;
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
        sheet1.set(1, i, ename);
        sheet1.set(2, i, elbowtype);
        sheet1.set(3, i, edesc);
        sheet1.set(4, i, equantity);
        i++;
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
        sheet1.set(1, i, iname);
        sheet1.set(2, i, isisflotype);
        sheet1.set(3, i, idesc);
        sheet1.set(4, i, iquantity);
        i++;
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
        sheet1.set(1, i, iname);
        sheet1.set(2, i, isisflotype);
        sheet1.set(3, i, idesc);
        sheet1.set(4, i, iquantity);
        i++;
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
        sheet1.set(1, i, iname);
        sheet1.set(2, i, isisflotype);
        sheet1.set(3, i, idesc);
        sheet1.set(4, i, iquantity);
        i++;
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
        sheet1.set(1, i, iname);
        sheet1.set(2, i, isisflotype);
        sheet1.set(3, i, idesc);
        sheet1.set(4, i, iquantity);
        i++;
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
        sheet1.set(1, i, inven[10]);
        sheet1.set(2, i, inven[11]);
        sheet1.set(3, i, inven[12]);
        sheet1.set(4, i, inven[13]);
        i++;
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
        sheet1.set(1, i, iname);
        sheet1.set(2, i, isisflotype);
        sheet1.set(3, i, idesc);
        sheet1.set(4, i, iquantity);
        i++;
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
        sheet1.set(1, i, pname);
        sheet1.set(2, i, pextype);
        sheet1.set(3, i, pdesc);
        sheet1.set(4, i, pquantity);
        i++;
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
        sheet1.set(1, i, pname);
        sheet1.set(2, i, pextype);
        sheet1.set(3, i, pdesc);
        sheet1.set(4, i, pquantity);
        i++;
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
        sheet1.set(1, i, pname);
        sheet1.set(2, i, pextype);
        sheet1.set(3, i, pdesc);
        sheet1.set(4, i, pquantity);
        i++;
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
        sheet1.set(1, i, pname);
        sheet1.set(2, i, pextype);
        sheet1.set(3, i, pdesc);
        sheet1.set(5, i, plength);
        i++;
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
        sheet1.set(1, i, pname);
        sheet1.set(2, i, pextype);
        sheet1.set(3, i, pdesc);
        sheet1.set(5, i, plength);
        i++;
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
        sheet1.set(1, i, pname);
        sheet1.set(2, i, pextype);
        sheet1.set(3, i, pdesc);
        sheet1.set(5, i, plength);
        i++;
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
        sheet1.set(1, i, name);
        sheet1.set(2, i, type);
        sheet1.set(3, i, desc);
        sheet1.set(4, i, quantity);
        i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
      sheet1.set(1, i, name);
      sheet1.set(2, i, type);
      sheet1.set(3, i, desc);
      sheet1.set(4, i, quantity);
      i++;
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
        sheet1.set(1, i, name);
        sheet1.set(2, i, type);
        sheet1.set(3, i, desc);
        sheet1.set(4, i, quantity);
        i++;
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
        sheet1.set(1, i, name);
        sheet1.set(5, i, length);
        i++;
    }
// for (var i = 2; i < 25; i++) {
//     sheet1.set(i, 1, inven[i]);
//   }
  workbook.save(function(ok){
    if (!ok)
      workbook.cancel();
    else
      console.log('congratulations, your workbook created');
  });


    // fs.writeFile('formList.csv', inven, 'utf8', function(err) {
    //     if (err) {
    //         console.log('Some error occured - file either not saved or corrupted file saved.');
    //     } else {
    //         console.log('It\'s saved!');
    //     }
    // });
})
