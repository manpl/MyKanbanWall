var express = require('express'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	app = express(),
	bodyParser = require('body-parser'),
	dbModel = require('./kbwDbModel.js'),
	KanbanBoardItem = dbModel.KanbanBoardItem,
	User = dbModel.User,
	Project = dbModel.Project,
	session = require('cookie-session'),
	md5 = require('MD5');



app.use(morgan('dev')); 	
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(session({
	keys: ['ang00l@415'],
  secureProxy: true // if you do SSL outside of node
}))

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function callback () { 
	console.log('Connection open'); 
});
app.use('/', express.static(__dirname  + '/../app'));


app.route('/login/')
	.post(function(req, res, next){
		var user = req.body.username,
			pass = req.body.password;

		if(user && pass){
			pass = md5(pass);
			User.findOne({email: user, password: pass}, function(err, data){
				if(!err && data){
					console.log('user authenticated' + data)
					req.session.userId = data._id;
					req.session.displayName = data.displayName;
					res.json(200, {displayName: data.displayName})
					res.end();

				}else{
					res.send(401);
				}

				res.end();
			});

		}
		else
		{
			res.send(401);
			res.end();
		}
	});
	
app.route('/logout/')
	.post(function(req, res, next){
		// 4 cookie based sessions
		req.session = null;
		res.send(200);
		res.end();
	});
///

var getProjectFilter = function(f){
	var result = {};

	if(f.name) result.name = f.name;
	if(f.createdBy) result.owner = { name: f.createdBy};
	

}

app.route('/api/projects/')
.get(function(req, res, next){

	console.log('/api/projects')

	var page = req.query.pageNo,
		pageSize = req.query.pageSize,
		sort = req.query.sortBy,
		skip = page * pageSize,
		filter = req.query.filter;

	var options = {};

	if(!isNaN(pageSize) && !isNaN(skip)) {
		options = { skip: skip, limit: pageSize };
	}else{
		options = { skip: 0, limit: 100};
	}

	if(!filter) filter = {};

	if(options.limit > 100) options.limit = 100;

	Project.count(filter, function(errCount, count){
		if(errCount){

		rese.send(500)
		res.end();
		}
		Project.find(filter, {}, options, function(err, data){
			var result = {
				page: page,
				total: count,
				data: data
			};

			res.json(result);
			res.end();
		});
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