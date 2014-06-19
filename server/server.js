var express = require('express'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	app = express(),
	bodyParser = require('body-parser'),
	dbModel = require('./kbwDbModel.js'),
	KanbanBoardItem = dbModel.KanbanBoardItem,
	User = dbModel.User,
	Project = dbModel.Project;



app.use(morgan('dev')); 	
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))


mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function callback () { console.log('Connection open'); });
app.use('/', express.static(__dirname  + '/../app'));


app.route('/api/projects/')
.get(function(req, res, next){
	Project.find({}, function(err, data){
			res.json(data);
		});
	});


app.route('/api/users/')
.post(function(req, res, next){
	console.log('post users');
	console.log(req.body);
	var bd = req.body;

	//if(bd.displayName && bd.email && bd.password && bd.dateOfBirth && bd.createdOn){
		new User({displayName: bd.displayName, email: bd.email, password: bd.password, dateOfBirth: bd.dateOfBirth,
			createdOn: new Date()
		}).save(function(err, item){
			if(err){
				if(err.code == 11000)
				{
					return res.send(400, {errors: 
						{"email": {"message": "This e-mail address is already registered"}
					}});
				}
				console.log(err);
				res.send(500, err);		
			}
			else{
				res.location("/api/users/" + item._id);
				res.send(200)
				res.end();
			}
		});
	//}
});

app.route('/api/items/')
.get(function(req, res, next){
	KanbanBoardItem.find({}, function(err, data){
			res.json(data);
		});
	})
	.post(function(req, res, next){

		new Project({name:'Kanban board', description: 'Kanban board application just for crack',
			owner: {name: 'Marcin'}, createdOn: new Date()
		}).save();;

		new KanbanBoardItem({ description: 'Learn', state: 'Planned', createdOn: new Date(), createdBy: 'userid\\1', projectId: 'projectID\\1' }).save(function(err, item){
			if (err){
				console.log('Saved', item);
				res.send(500, 'ooops something wrong');
			}
			else{
				console.log('Item saved', item);
				res.send(200, 'Item saved');
			}
			
		});		
	});

app.route('/api/items/:id')
	.get(function(req, res, next){
		console.log('id:= ', req.params.id);
	
		KanbanBoardItem.find({"_id": req.params.id}, function(err, data){
			res.json(data);
		});
	})

var server = app.listen(3000, function() { 
	console.log('Listening on port %d', server.address().port);
});

// response.redirect("http://...");
// response.sendFile("/...");