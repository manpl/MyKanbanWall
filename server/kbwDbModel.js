var mongoose = require('mongoose'),
		md5 = require('MD5');

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


projectSchema.pre('save', function (next) {
  
  if(this.isNew){
  	this.createdOn = new Date();
  }

  next();
});

exports.Project = mongoose.model('Project', projectSchema);


var userSchema = mongoose.Schema({
	displayName: { type: String, required: true, trimmed: true},
	email:{ type: String, index: {unique: true, trimmed: true}},
	password:{ type: String, required: true, trimmed: true},
	dateOfBirth: { type: Date, required: true},
	createdOn: { type: Date, required: true},
	updateOn: { type: Date, required: false},
	confirmed: Boolean
});

userSchema.pre('save', function (next) {
  this.updatedOn = new Date();
  this.email = this.email.toLowerCase();

  if(!this.isModified('password'))
  	this.password = md5(this.password);
  
  next();
});

userSchema.path('email').validate(function (email) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field is invalid.')


exports.User = mongoose.model('User', userSchema);
