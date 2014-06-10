var express = require('express'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	app = express();

app.use(morgan('dev')); 	

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

var kanbanItemSchema = mongoose.Schema({
	description: String,
	state: String,
	createdOn: Date,
	createdBy: String,
	projectId: String
});

var KanbanBoardItem = mongoose.model('KanbanBoardItem', kanbanItemSchema);

db.once('open', function callback () { console.log('Connection open'); });

app.use('/', express.static(__dirname ));


app.route('/api/items/')
.get(function(req, res, next){
	KanbanBoardItem.find({}, function(err, data){
			res.json(data);
		});
	})
	.post(function(req, res, next){
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