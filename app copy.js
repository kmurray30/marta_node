var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mysql = require('mysql');

var app = express();

var db = mysql.createConnection({
	// properties...
	connectionLimit: 50,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'martanode'
});

// app.get('/createdb', (req, res) => {
// 	let sql = 'CREATE DATABASE nodemysql';
// 	db.query(sql, (err, result) => {
// 		if(err) throw err;
// 		console.log(result);
// 		res.send('Database created...');
// 	});
// });

db.connect(function(error) {
	if(!!error) {
		console.log('MySql Error');
	} else {
		console.log('MySql Connected');
	}
});

app.listen(1337)

//var db = mongojs('customerapp', ['users']);
//require

// var logger = function(req, res, next){
// 	console.log('Logging');
// 	next();
// }

// app.use(logger);

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	res.locals.msg = null;
	next();
});

// Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
			var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param 	: formParam,
			msg 	: msg,
			value	: value
		};
	}
}));

var users = [
	{
		id: 1,
		first_name: 'John',
		last_name: 'Doe',
		email: 'johndoe@gmail.com'
	},
	{
		id: 2,
		first_name: 'Jane',
		last_name: 'Doe',
		email: 'janedoe@gmail.com'
	},
	{
		id: 3,
		first_name: 'Bob',
		last_name: 'Waters',
		email: 'bobbyboi@gmail.com'
	}
]

app.get('/', function(req, res){
	//db.users.find(function(err, docs){
		//render in here, users: docs
	//})
	db.query("SELECT * FROM USER", function(error, rows, fields) {
		if (!!error) {
			console.log('Error in the query');
		} else {
			console.log('Successfully queried');
		}
	});
	var title = 'Customers';
	res.render('login', {
		title: 'Customers',
		users: users
	});
});

app.post('/users/add', function(req, res){

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();
	var message1;

	if(errors){
	} else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}
		console.log('SUCCESS');
		console.log(newUser);
		message1 = "Successfully added new user!"
	}
	res.render('login', {
		title: 'Customers',
		users: users,
		errors: errors,
		msg: message1
	});
	redirect('/');
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
});