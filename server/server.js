var express = require('express'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	app = express(),
	dbModel = require('./kbwDbModel.js'),
	KanbanBoardItem = dbModel.KanbanBoardItem,
	Project = dbModel.Project;

app.use(morgan('dev')); 	

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
	

app.get('/api/users.json', function(req, res){
  res.json([{name:'john', surname: 'doe', age: 65}]);
});


var server = app.listen(3000, function() { 
	console.log('Listening on port %d', server.address().port);
});

// response.redirect("http://...");
// response.sendFile("/...");