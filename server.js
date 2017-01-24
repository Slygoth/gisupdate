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
	res.send('Todo API Root');
});

// Update the gis data
app.post('/update', function(req, res) {
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
			features: '[{ "attributes": { "OBJECTID": 145, "FID": 5258, "LOG_DATE": null, "LOCAT_DESC": "asfbhjasdbhsafbsad", "REMARKS": " ", "LEAK_STATUS": "rep" }, "geometry": { "x": -76.7386527749252, "y": 17.9932317466246 } }]',
			token: 'XnsPROAxDN6v3tlvGvwvrA_YK8w3EU1Ga-36pQgrNMv9IjH8eS9BmSPL9W2xYalk27IuULwlMKkT3Vx_8KLtauu4f8krs7BcRZJsaVaN48OefBgs93__fk8yGZgcP5LBkLzyfKOSSNNYKo4FwpMmkSA_2Tq3Iy9HSxEzPvqXaPREfCJw7L_NBhBWdpVQR37J',
			f: 'json'
	}));
	req.end();
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedTodo) {
		res.status(404).json({
			"error": "no todo found with that id"
		});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
