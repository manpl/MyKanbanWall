var dbModel = require('./kbwDbModel.js'),
	Project = dbModel.Project
;

app.route('/api/projects/')
.get(function(req, res, next){
	console.log(req.query);

	Project.find({}, function(err, data){
			res.json(data);
		});
	});
