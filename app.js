var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var session = require('express-session');
var moment = require('moment');
// var crypto = require('crypto');
var passwordHash = require('password-hash');
const url = require('url');

// var message;
// var errors;

var app = express();

var db = mysql.createConnection({
	// properties...
	connectionLimit: 50,
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'martanode'
});

app.get('/createdb', (req, res) => {
	let sql = "INSERT INTO USER (Username, Password, IsAdmin) VALUES ('asdf', 'asdf', 1)";
	db.query(sql, (err, result) => {
		if(err) {
			res.send(err);
		} else {
			res.send('Created USER: asdf, asdf, 1');
		}
	});
});

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

app.use(session({secret: "jqwe0r8713h4rkjndf09g8h", resave: false, saveUninitialized: true}));

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
	res.locals.message = null;
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
	req.session.messageQ = [];
	res.render('login', {
	});
});

app.post('/login', function(req, res){
	req.checkBody('username', 'username is Required').notEmpty();
	req.checkBody('password', 'password is Required').notEmpty();


	errors = req.validationErrors();
	var message;
	var errors;

	if(errors){
		console.log(errors);
		res.render('login', {
			message: message,
			errors: errors
		});
	} else {
		var username = req.body.username;
		var password = req.body.password;
		var sql = "SELECT username, password, isAdmin FROM USER WHERE Username = '" + username + "'";
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			console.log("result: " + result);
			// res.send(result);
			if (result == null || result.length == 0) {
				message = "Invalid username";
			} else if (!passwordHash.verify(password, result[0].password)){
				message = "Wrong password"
			} else {
				// message = '  Hi ' + result[0].username + '! Your password is ' + result[0].password + ' lol';
				var isAdmin = result[0].isAdmin;
				console.log(isAdmin);
				req.session.username = username;
				if (isAdmin == '1') {
					req.session.isAdmin = true
					res.redirect(url.format({
					       pathname:"/admin_main",
					       // query: {
					       //    "a": 1,
					       //    "b": 2,
					       //    "valid":"your string here"
					       //  }
					     }));
				} else {
					req.session.isAdmin = false
					req.session.user = true
					res.redirect(url.format({
					       pathname:"/passenger"
					       // query: {
					       //    "a": 1,
					       //    "b": 2,
					       //    "valid":"your string here"
					       //  }
					     }));
				}
				return;
			}

			res.render('login', {
				message: message,
				errors: errors
			});
			// res.redirect('/home')
			return;
		});
	}
});

app.post('/toregister', function(req, res){
	console.log("POST toregister");
	res.redirect('/register')
});

app.get('/register', function(req, res){
	console.log('GET register')
	// console.log("2 messages: " + req.session.messageQ);
	if (req.session.messageQ == undefined) {
		req.session.messageQ = [];
	}
	messages = req.session.messageQ;
	res.render('register', {
		messages: messages
	});
});

function isEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

app.post('/createaccount', function(req, res){
	console.log("GET createaccount");
	// res.redirect('/register');
	req.session.messageQ = [];
	var username = req.body.username;
	var password = req.body.password;
	password = passwordHash.generate(password);
	var confirm = req.body.confirm;
	var email = req.body.email;
	var cardnum = req.body.cardnum;
	var hasCard = req.body.hasCard == 'true';
	console.log("hasCard: " + hasCard);
	var exists = true;
	console.log("email = " + email);
	// req.session.messageQ.push(username);
	if (username == '' || username == '' || username == '' || username == '' || email == '') {
		req.session.messageQ.push("There are empty fields");
		res.redirect('/register');
		return;
	} else if (!isEmail(email)) {
		req.session.messageQ.push("Email is not in proper format");
		res.redirect('/register');
		return;
	} else if (confirm != password) {
		req.session.messageQ.push("Passwords do not match");
		res.redirect('/register');
		return;
	} else if (password.length < 8) {
		req.session.messageQ.push("Passwords must be at least 8 characters");
		res.redirect('/register');
		return;
	} else if (hasCard && (isNaN(cardnum) || cardnum.length != 16)) {
		req.session.messageQ.push("Invalid card format. Please use exactly 16 digits");
		res.redirect('/register');
		return;
	} else {
		var sql = "SELECT * FROM PASSENGER WHERE Username = '" + username + "' OR Email = '" + email + "'";
		console.log(sql)
		var query = db.query(sql, (err, result) => {
			console.log(result[0]);
			if(err || result.length < 1) {
				exists = false;
				console.log("user doesn't exist");
				checkCardAddUser(req, res, username, password, email, cardnum, hasCard)
				// res.redirect('/passenger_main'); moved to sql
			} else {
				console.log("user already exists");
				req.session.messageQ.push("User or email already exists");
				res.redirect('/register')
			}
		});
	}
});

function checkCardAddUser(req, res, username, password, email, cardnum, hasCard) {
	if (hasCard) {
		var sql = "SELECT * FROM BREEZE_CARD WHERE Number = '" + cardnum + "'";
		var query = db.query(sql, (err, result) => {
			if(err) throw err
			if (result.length == 0) { // didn't find existing card
				req.session.messageQ.push("Card does not exist");
				res.redirect('/register');
				return;
			} else {
				dateTime =  moment().format('YYYY/MM/DD HH:mm:ss')
				sql = "INSERT INTO CONFLICT (Username, Number, DateTime) VALUES ('" + username + "', '" + cardnum + "', '" + dateTime + "')";
				addUser(req, res, username, password, email, sql)
			}
		});
	} else {
		addUser(req, res, username, password, email, '');
	}
}

function createNewCard(req, res, username, password, email) {
	var cardnum = Math.round(Math.random()*9999999999999999).toString();
	while (cardnum.length < 16) {
		cardnum = '0' + cardnum;
	}
	console.log("new card num: " + cardnum);
	var sql = "INSERT INTO BREEZE_CARD (Number, Value, Username) VALUES ('" + cardnum + "', " + 0 + ", '" + username + "')";
	var query = db.query(sql, (err, result) => {
		if(err) {
			throw err;
		} else {
			console.log("Created BREEZE_CARD: '" + cardnum + "', '" + username + "");
		}
	});
}

function addUser(req, res, username, password, email, conflict) {
	var sql = "INSERT INTO USER (Username, Password, IsAdmin) VALUES ('" + username + "', '" + password + "', " + 0 + ")";
	var query = db.query(sql, (err, result) => {
		if(err) {
			throw err;
		} else {
			console.log("Created USER: '" + username + "', '" + password + "', " + 0 + "");
		}
	});
	var sql = "INSERT INTO PASSENGER (Username, Email) VALUES ('" + username + "', '" + email + "')";
	var query = db.query(sql, (err, result) => {
		if(err) {
			throw err;
		} else {
			console.log("Created PASSENGER: '" + username + "', '" + email + "");
			createNewCard(req, res, username, password, email);
			if (conflict.length > 0) {
				sql = conflict;
				var query = db.query(sql, (err, result) => {
					if(err) {
						throw err;
					} else {
						console.log("Created CONFLICT: '" + conflict + "");
					}
					res.redirect('/passenger_main');
				});
			} else {
				res.redirect('/passenger_main');
			}
		}
	});
}

app.get('/admin_main', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}

	console.log('GET admin_main')
	res.render('admin_main', {
	});
});

app.get('/admin_stationmanage', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}

	var sql = 'SELECT StopID, EnterFare, ClosedStatus, Name, IsTrainStation FROM STATION WHERE 1';
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		res.render('admin_stationmanage', {
			stations: result
		});
	});
	console.log('GET admin_stationmanage')
});

app.get('/admin_stationview', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/');
		return
	}

	console.log('admin_stationview')
	var stationId = req.query.stationId;


	var sql = "SELECT STATION.StopID, EnterFare, ClosedStatus, Name, IsTrainStation, Intersection FROM STATION LEFT JOIN BUS_STATION ON STATION.StopID = BUS_STATION.StopID WHERE STATION.StopID = '" + stationId + "'";
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		if (result[0].IsTrainStation == 1) {
			result[0].Intersection = 'Not available for train stations';
		}
		messages = req.session.messageQ;
		req.session.messageQ = [];
		res.render('admin_stationview', {
			station: result[0],
			messages: messages
		});
	});
});

app.post('/updatefare', function(req, res){
	var fare = req.body.fare;
	var isClosed = req.body.isOpen == undefined ? 1 : 0;
	var stopID = req.query.stationId;
	var sql = "";
	if(fare == null || isNaN(fare) || fare < 0 || fare > 50) {
		req.session.messageQ.push("fare must be number between 0 and 50");
	} else {
		// Query database
		sql = "UPDATE STATION SET EnterFare=" + fare + " WHERE StopID='" + stopID + "'";
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			console.log("THIS PASSES");
		});
	}
	sql = "UPDATE STATION SET ClosedStatus=" + isClosed + " WHERE StopID='" + stopID + "'";
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
	});
	res.redirect('/admin_stationview?stationId=' + req.query.stationId);
	return;
	
});

// app.post('/openstation', function(req, res){
// 	if(req.query.action == "close") {
// 		// Query close
// 	} else {
// 		// Query open
// 	}
// 	res.redirect('/admin_stationview?stationId=' + req.query.stationId);
// 	return;
// });

app.get('/admin_createstation', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/admin_createstation');
		return
	}

	console.log('admin_createstation')
	res.render('admin_createstation', {
	});
});

app.get('/admin_suspendedcards', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/admin_suspendedcards')
		return
	}

	console.log('admin_suspendedcards')
	res.render('admin_suspendedcards', {
	});
});

app.get('/admin_cardmanage', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/admin_cardmanage')
		return
	}

	console.log('admin_cardmanage')
	res.render('admin_cardmanage', {
	});
});

app.get('/admin_flowreport', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/admin_flowreport')
		return
	}

	console.log('admin_flowreport')
	res.render('admin_flowreport', {
	});
});

app.get('/passenger_main', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/passenger_main')
		return
	}

	console.log('passenger_main')
	res.render('passenger_main', {
	});
});

app.get('/passenger_cardmanage', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/passenger_cardmanage')
		return
	}

	console.log('passenger_cardmanage')
	res.render('passenger_cardmanage', {
	});
});

app.get('/passenger_triphistory', function(req, res){
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/passenger_triphistory')
		return
	}

	console.log('passenger_triphistory')
	res.render('passenger_triphistory', {
	});
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
});