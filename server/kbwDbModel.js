var mongoose = require('mongoose');

var kanbanItemSchema = mongoose.Schema({
	description: String,
	state: String,
	createdOn: Date,
	updatedOn: Date,
	createdBy: String,
	projectId: String
});


kanbanItemSchema.pre('save', function (next) {
  this.updatedOn = new Date();
  next();
});

exports.KanbanBoardItem = mongoose.model('KanbanBoardItem', kanbanItemSchema);

var projectSchema = mongoose.Schema({
	name: String,
	description: String,
	createdOn: Date,
	owner: {
		name: String,
		userId: mongoose.Schema.Types.ObjectId
	},
	editors: [mongoose.Schema.Types.ObjectId]
});

exports.Project = mongoose.model('Project', projectSchema);


var userSchema = mongoose.Schema({
	displayName:String,
	email:String,
	password:String,
	dateOfBirth: Date,
	createdOn: Date,
	updateOn: Date
});

userSchema.pre('save', function (next) {
  this.updatedOn = new Date();
  next();
});

exports.User = mongoose.model('User', userSchema);
