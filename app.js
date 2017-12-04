var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mysql = require('mysql');
var session = require('express-session');
var moment = require('moment');
// var crypto = require('crypto');
// var passwordHash = require('password-hash');
var md5 = require('md5');
var hrt = require('human-readable-time');
var datetime = require('node-datetime');
const url = require('url');

// var message;
// var errors;

var app = express();

// var db = mysql.createConnection({
// 	// properties...
// 	connectionLimit: 50,
// 	host: 'localhost',
// 	user: 'root',
// 	password: '',
// 	database: 'martanode'
// });

var db = mysql.createConnection({
	// properties...
	connectionLimit: 50,
	host: 'academic-mysql.cc.gatech.edu',
	user: 'cs4400_Group_46',
	password: 'T62yYcnG',
	database: 'cs4400_Group_46'
});

// app.get('/createdb', (req, res) => {
// 	let sql = "INSERT INTO USER (Username, Password, IsAdmin) VALUES ('asdf', 'asdf', 1)";
// 	db.query(sql, (err, result) => {
// 		if(err) {
// 			res.send(err);
// 		} else {
// 			res.send('Created USER: asdf, asdf, 1');
// 		}
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

function getMessages(req) {
	if (req.session.messageQ == undefined) {
		req.session.messageQ = [];
	}
	messages = req.session.messageQ;
	req.session.messageQ = [];
	return messages;
}

app.post('/', function(req, res){
	console.log("POST /");
	res.redirect('/');
});

app.get('/', function(req, res){
	console.log("GET /");
	req.session.messageQ = [];
	res.render('login', {
	});
});

// Just to handle going to POST urls
app.get('/login', function(req, res){
	console.log("GET /login");
	res.redirect('/')
});
app.get('/createaccount', function(req, res){
	console.log("GET /createaccount");
	res.redirect('/')
});
app.get('/createstation', function(req, res){
	console.log("GET /createstation");
	res.redirect('/')
});
app.get('/updatefare', function(req, res){
	console.log("GET /updatefare");
	res.redirect('/')
});

app.post('/login', function(req, res){
	console.log("POST /login");
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
			if (result == null || result.length == 0) {
				message = "Invalid username";
			} else if (result[0].password != md5(password)){
				message = "Wrong password"
			} else {
				var isAdmin = result[0].isAdmin;
				console.log(isAdmin);
				req.session.username = username;
				if (isAdmin == '1') {
					req.session.isAdmin = true
					res.redirect(url.format({
					       pathname:"/admin_main"
					     }));
				} else {
					req.session.isAdmin = false
					req.session.user = true
					res.redirect(url.format({
					       pathname:"/passenger_main"
					     }));
				}
				return;
			}

			res.render('login', {
				message: message,
				errors: errors
			});
			return;
		});
	}
});

app.post('/toregister', function(req, res){
	console.log("POST toregister");
	res.redirect('/register')
});

app.get('/register', function(req, res){
	console.log("GET register")
	if (req.session == null) {
		return res.status(401).send();
	}
	console.log('GET register')
	if (req.session.messageQ == undefined) {
		req.session.messageQ = [];
	}
	messages = req.session.messageQ;
	req.session.messageQ = [];
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
	req.session.messageQ = [];
	var username = req.body.username;
	var passwordOrig = req.body.password;
	password = md5(passwordOrig);
	var confirm = req.body.confirm;
	confirm = md5(confirm);
	var email = req.body.email;
	var cardnum = req.body.cardnum;
	var hasCard = req.body.hasCard == 'true';
	console.log("hasCard: " + hasCard);
	var exists = true;
	console.log("email = " + email);
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
	} else if (passwordOrig.length < 8) {
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
		var sql = "SELECT Username FROM BREEZE_CARD WHERE Number = '" + cardnum + "'";
		var query = db.query(sql, (err, result) => {
			if(err) throw err
			if (result.length == 0) { // didn't find existing card
				req.session.messageQ.push("Card does not exist");
				res.redirect('/register');
				return;
			} else {
				dateTime =  moment().format('YYYY/MM/DD HH:mm:ss');
				sql = '';
				if (result[0].Username) {
					sql = "INSERT INTO CONFLICT (Username, Number, DateTime) VALUES ('" + username + "', '" + cardnum + "', '" + dateTime + "')";
				}
				addUser(req, res, username, password, email, sql)
			}
		});
	} else {
		addUser(req, res, username, password, email, '');
	}
}

function createNewCard(req, res, username) {
	var cardnum = Math.round(Math.random()*9999999999999999).toString();
	while (cardnum.length < 16) {
		cardnum = '0' + cardnum;
	}
	console.log("new card num: " + cardnum);
	var sql = "INSERT INTO BREEZE_CARD (Number, Value, Username) VALUES ('" + cardnum + "', " + 0 + ", '" + username + "')";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log(result);
		console.log("Created BREEZE_CARD: '" + cardnum + "', '" + username + "");
	});
	return cardnum;
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
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) {
			throw err;
		} else {
			console.log("Created PASSENGER: '" + username + "', '" + email + "");
			createNewCard(req, res, username);
			if (conflict.length > 0) {
				sql = conflict;
				var query = db.query(sql, (err, result) => {
					if(err) throw err;
					console.log("Created CONFLICT: '" + conflict + "");
					req.session.user = true;
					res.redirect('/');
				});
			} else {
				req.session.user = true;
				res.redirect('//');
			}
		}
	});
}

app.get('/admin_main', function(req, res){
	console.log("GET /admin_main");
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
	console.log("GET /admin_stationmanage");
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
	console.log("GET /admin_stationview");
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
	console.log("POST /updatefare");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}
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
	console.log("GET /admin_createstation");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/');
		return
	}

	console.log('admin_createstation')
	if (req.session.messageQ == undefined) {
		req.session.messageQ = [];
	}
	messages = req.session.messageQ;
	req.session.messageQ = [];
	res.render('admin_createstation', {
		messages: messages
	});
});

app.post('/createstation', function(req, res){
	console.log("POST /createstation");

	req.session.messageQ = [];
	var stationName = req.body.stationName;
	var stationID = req.body.stationID;
	var fare = req.body.fare;
	var intersection = req.body.intersection;
	var isBus = req.body.isBus == 'true';
	var isOpen = req.body.isOpen != undefined;
	if (stationName == '' || stationID == '' || fare == '') {
		req.session.messageQ.push("There are empty fields");
		res.redirect('/admin_createstation');
		return;
	} else if (fare == null || isNaN(fare) || fare < 0 || fare > 50) {
		req.session.messageQ.push("fare must be number between 0 and 50");
		res.redirect('/admin_createstation');
		return;
	} else {
		isTrain = isBus ? 0 : 1
		isClosed = isOpen ? 0 : 1
		var sql = "SELECT * FROM STATION WHERE Name = '" + stationName + "' AND IsTrainStation = " + isTrain;
		console.log(sql)
		var query = db.query(sql, (err, result) => {
			// console.log(result[0]);
			if(err) throw err;
			if(result.length < 1) {
				exists = false;
				var sql = "SELECT * FROM STATION WHERE StopID = '" + stationID + "'";
				console.log(sql)
				var query = db.query(sql, (err, result) => {
					// console.log(result[0]);
					if(err || result.length < 1) {
						exists = false;
						console.log("station doesn't exist");
						createStation(req, res, stationName, stationID, fare, intersection, isTrain, isClosed);
					} else {
						console.log("station already exists");
						req.session.messageQ.push("Station already exists");
						res.redirect('/admin_createstation')
					}
				});
			} else {
				// result.forEach(function(res) { // For SQL injection
				// 	req.session.messageQ.push(res.Name + " station already exists");
				// 	console.log(res.Name);
				// })
				console.log("station already exists");
				req.session.messageQ.push("Station already exists");
				res.redirect('/admin_createstation')
			}
		});
	}
});

function createStation(req, res, stationName, stationID, fare, intersection, isTrain, isClosed) {
	var sql = "INSERT INTO STATION (StopID, EnterFare, ClosedStatus, Name, IsTrainStation) VALUES ('" + stationID + "', " + fare + ", " + isClosed + ", '" + stationName + "', " + isTrain + ")";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		if (!isTrain) {
			var sql = "INSERT INTO BUS_STATION (StopID, Intersection) VALUES ('" + stationID + "', '" + intersection + "')";
			console.log(sql);
			var query = db.query(sql, (err, result) => {
				if(err) {
					throw err;
				} else {
					console.log("Created STATION: '" + stationName + "', '" + stationID);
					req.session.messageQ.push("Bus station " + stationName + " created");
					res.redirect('admin_createstation')
				}
			});
		} else {
			console.log("Created STATION: '" + stationName + "', '" + stationID);
			req.session.messageQ.push("Train station " + stationName + " created");
			res.redirect('admin_createstation')
		}
	});
}

app.get('/admin_suspendedcards', function(req, res){
	console.log("GET /admin_suspendedcards");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}

	var sql = "SELECT BREEZE_CARD.Username AS OldUser, Value, BREEZE_CARD.Number, DateTime, CONFLICT.Username AS NewUser FROM CONFLICT LEFT JOIN BREEZE_CARD ON CONFLICT.Number = BREEZE_CARD.Number WHERE 1";
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log('admin_suspendedcards');
		if (req.session.messageQ == undefined) {
			req.session.messageQ = [];
		}
		messages = req.session.messageQ;
		req.session.messageQ = [];
		res.render('admin_suspendedcards', {
			cards: result,
			hrt: hrt,
			messages: messages
		});
	});
});

app.get('/unlock', function(req, res){
	console.log("GET /unlock");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}

	var cardnum = req.query.cardnum;
	var newUser = req.query.newUser;
	var toNew = req.query.toNew == '1' ? true : false;

	// res.send("assign " + cardnum + " to " + toNew);

	var sql = "SELECT BREEZE_CARD.Username AS OldUser, Value, BREEZE_CARD.Number, DateTime, CONFLICT.Username AS NewUser FROM CONFLICT LEFT JOIN BREEZE_CARD ON CONFLICT.Number = BREEZE_CARD.Number WHERE CONFLICT.Number = '" + cardnum + "' AND CONFLICT.Username = '" + newUser + "'";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		if (result.length < 1) {
			console.log("Queried card from table. There should be a result but there isn't");
			throw err;
		}
		if (!result[0].OldUser) {
			req.session.messageQ.push("Previous user no longer exists");
			res.redirect('/');
			return
		}
		var origQuery = result;
		// Delete all rows in this conflict with same card
		var sql = "DELETE FROM CONFLICT WHERE Number = '" + cardnum + "'";
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			console.log("Deleted conflicts");
			req.session.messageQ.push("Conflict on card " + cardnum + " resolved");
			if (toNew) {
				sql = "UPDATE BREEZE_CARD SET Username = '" + origQuery[0].NewUser +  "' WHERE Number = '" + cardnum + "'";
				console.log(sql);
				var query = db.query(sql, (err, result) => {
					if(err) throw err;
					req.session.messageQ.push("Assigned to " + origQuery[0].NewUser);
					sql = "SELECT Username FROM BREEZE_CARD WHERE Username = '" + origQuery[0].OldUser + "'";
					var query = db.query(sql, (err, result) => {
						if(err) throw err;
						if (result.length < 1) {
							cardnum = createNewCard(req, res, origQuery[0].OldUser);
							req.session.messageQ.push(origQuery[0].OldUser + " given new card " + cardnum);
							res.redirect('/admin_suspendedcards');
						} else {
							req.session.messageQ.push(origQuery[0].OldUser + " has other cards");
							res.redirect('/admin_suspendedcards');
						}
					});
				});
			} else {
				req.session.messageQ.push("Assigned to " + origQuery[0].OldUser);
				res.redirect('/admin_suspendedcards');
			}
		});
			


		// If assigned to new, swap names on new user's old card and his new card's old user
		// If assigned to old, do nothing 
	});


	// var sql = "SELECT BREEZE_CARD.Username AS OldUser, Value, BREEZE_CARD.Number, DateTime, CONFLICT.Username AS NewUser FROM CONFLICT LEFT JOIN BREEZE_CARD ON CONFLICT.Number = BREEZE_CARD.Number WHERE 1";
	// var query = db.query(sql, (err, result) => {
	// 	if(err) throw err;
	// 	console.log('admin_suspendedcards');
	// 	// res.send(result);
	// 	res.render('admin_suspendedcards', {
	// 		cards: result,
	// 		hrt: hrt
	// 	});
	// });
});

app.post('/filtercards', function(req, res){
	console.log("POST /updatefilter");

	var stationName = req.body.stationName;
	res.redirect(url.format({
       pathname:"/admin_cardmanage",
       query: {
          "owner": req.body.owner,
          "cardnum": req.body.cardnum,
          "low": req.body.low,
          "high": req.body.high,
          "showsus": req.body.showSuspended == 'show'
        }
     }));
});

// app.post('/nofilter', function(req, res){
// 	console.log("POST /nofilter");
// 	res.redirect('/admin_cardmanage');
// });

app.get('/updatecardvalue', function(req, res){
	console.log("POST /updatecard");
	var val = req.query.newvalue;
	if (!val || isNaN(val) || val < 0 || val > 1000) {
		req.session.messageQ.push("value must be valid number between 0 and 1000");
		res.redirect("/admin_cardmanage");
	} else {
		var cardnum = req.query.cardnum;
		var newValue = req.query.newvalue
		sql = "UPDATE BREEZE_CARD SET Value = " + newValue + " WHERE Number = '" + cardnum + "'";
		console.log(sql);
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			req.session.messageQ.push("successfully updated value to $" + newValue + " on card " + cardnum);
			res.redirect('/admin_cardmanage');
		});
	}
});

app.get('/updatecardowner', function(req, res){
	console.log("POST /updatecardowner");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}
	var newOwner = req.query.newowner;
	var cardnum = req.query.cardnum;
	var sql = "SELECT * FROM PASSENGER WHERE Username = '" + newOwner + "'";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		if(result.length < 1) {
			req.session.messageQ.push("There is no passenger with this username");
			res.redirect('/admin_cardmanage');
			return;
		} else {
			sql = "SELECT Username FROM BREEZE_CARD WHERE Number = '" + cardnum + "'";
			console.log(sql);
			var query = db.query(sql, (err, result) => {
				if(err) throw err;
				var oldUser = result[0].Username;
				sql = "SELECT * FROM BREEZE_CARD WHERE Username = '" + oldUser + "'";
				console.log(sql);
				var query = db.query(sql, (err, result) => {
					if(err) throw err;
					if (result.length < 2) {
						req.session.messageQ.push("This is the previous user's last card. Cannot transfer");
						res.redirect('/admin_cardmanage');
						return;
					}
					sql = "DELETE FROM CONFLICT WHERE Number = '" + cardnum + "'";
					console.log(sql);
					var query = db.query(sql, (err, result) => {
						sql = "UPDATE BREEZE_CARD SET Username = '" + newOwner + "' WHERE Number = '" + cardnum + "'";
						console.log(sql);
						var query = db.query(sql, (err, result) => {
							if(err) throw err;
							req.session.messageQ.push("successfully updated owner to " + newOwner + " on card " + cardnum);
							res.redirect('/admin_cardmanage');
							return;
						});
					});
				});
			});
		}
	});
});

app.get('/admin_cardmanage', function(req, res){
	console.log("GET /admin_cardmanage");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}

	var owner = req.query.owner;
	var cardnum = req.query.cardnum;
	var low = req.query.low;
	var high = req.query.high;
	var showSus = req.query.showsus == 'true';

	// var sql = "SELECT BREEZE_CARD.Username, Value, BREEZE_CARD.Number, CONFLICT.Username AS NewUser FROM CONFLICT RIGHT JOIN BREEZE_CARD ON CONFLICT.Number = BREEZE_CARD.Number WHERE 1"
	var sql = "SELECT Number, Value, Username FROM BREEZE_CARD WHERE 1";
	if (owner) sql += " AND Username = '" + owner + "'";
	if (cardnum) sql += " AND Number = '" + cardnum + "'";
	if (low) sql += " AND Value > " + low;
	if (high) sql += " AND Value < " + high;
	if (!showSus) sql += " AND NOT EXISTS (SELECT * FROM CONFLICT WHERE BREEZE_CARD.Number = CONFLICT.Number)";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		if (req.session.messageQ == undefined) {
			req.session.messageQ = [];
		}
		messages = req.session.messageQ;
		req.session.messageQ = [];
		res.render('admin_cardmanage', {
			messages: messages,
			cards: result,
	        owner: owner,
	        cardnum: cardnum,
	        low: low,
	        high: high,
			showSus: showSus
		});
	});
});

app.post('/filterflow', function(req, res){
	console.log("POST /filterflow");
	var start = req.body.startTime;
	var end = req.body.endTime;
	res.redirect(url.format({
       pathname:"/admin_flowreport",
       query: {
          "start": start,
          "end": end
        }
     }));
});

app.get('/admin_flowreport', function(req, res){
	console.log("GET /admin_flowreport");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.isAdmin) {
		res.redirect('/')
		return
	}


	var startTime = req.query.starttime;
	var endTime = req.query.endtime;

	var sql = "CREATE VIEW FlowIn AS SELECT StopID, SUM(STATION.EnterFare) AS Revenue, COUNT(*) As PassengersIn FROM TRIP, STATION JOIN TRIP t ON t.StartsStopID = STATION.StopID"
	console.log(sql);
	if(startTime && endTime) {
		sql += " WHERE StartTime > " + startTime + " AND StartTime < " + endTime;
	}
	sql += " GROUP BY TRIP.StartsStopID";

	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		console.log("Result from query:");
		console.log(result);
		messages = getMessages(req);
		res.render('admin_flowreport', {
			messages: messages,
			start: startTime,
			end: endTime
		});
	});
});

app.get('/passenger_main', function(req, res){
	console.log("GET /passenger_main");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/')
		return
	}

	username = req.session.username;

	startID = req.query.startid;
	console.log("startID: " + startID);
	if (startID) req.session.startID = startID
	else startID = req.session.startID;
	endID = req.query.endid;
	if (endID) req.session.endID = endID
	else endID = req.session.endID;
	cardnum = req.query.cardnum;
	if (cardnum) req.session.cardnum = cardnum
	else cardnum = req.session.cardnum;


	sql = "SELECT Number, Value FROM BREEZE_CARD WHERE Username = '" + username + "' AND NOT EXISTS (SELECT * FROM CONFLICT WHERE BREEZE_CARD.Number = CONFLICT.Number)";
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		var resultCards = result;
		if (!cardnum) cardnum = result[0].Number;
		var sql = "SELECT StartsStopID, EndsStopID, TRIP.Number FROM TRIP LEFT JOIN BREEZE_CARD ON TRIP.Number = BREEZE_CARD.Number WHERE Username = '" + username + "'"
		var query = db.query(sql, (err, result) => {
			var resultTrips = result;
			var currentTrip = null;
			var isRiding = false;
			if(err) throw err;
			result.forEach(function(trip){
				if (trip.StartsStopID && !trip.EndsStopID) {
					startID = trip.StartsStopID;
					console.log("found unfinished trip: starts at " + startID)
					cardnum = trip.Number;
					console.log("cardnum=" + cardnum);
					isRiding = true;
					console.log("Passenger is riding!")
					req.session.messageQ.push("Passenger is riding");
				}
			});
			var sql = "SELECT Name, StopID, EnterFare, IsTrainStation FROM STATION WHERE 1"
			var query = db.query(sql, (err, result) => {
				if(err) throw err;
				var startname = '';
				if (!startID) startID = result[0].StopID;
				result.forEach(function(station){
					if (station.StopID == startID) {
						startName = station.Name;
						fare = station.EnterFare;
					}
				});
				if (!endID) endID = result[0].StopID;
				var endstation = null;
				result.forEach(function(station){
					if (station.StopID == endID) {
						endstation = station.Name;
					}
				});
				messages = getMessages(req);
				var value = 0;
				resultCards.forEach(function(card) {
					if (card.Number == cardnum){
						value = card.Value;
					}
				});
				res.render('passenger_main', {
					messages: messages,
					cardnum: cardnum,
					value: value,
					cards: resultCards,
					isRiding: isRiding,
					startName: startName,
					startID: startID,
					fare: fare,
					endStation: endstation,
					endID: endID,
					stations: result
				});
			});
		});
	});
});

app.get('/starttrip', function(req, res){
	console.log("GET /passenger_cardmanage");
	var timestamp = moment().format('YYYY/MM/DD HH:mm:ss');
	var stationID = req.query.startid;
	var cardnum = req.query.cardnum;
	sql = "SELECT Username, Value FROM BREEZE_CARD WHERE Number = '" + cardnum + "' AND NOT EXISTS (SELECT * FROM CONFLICT WHERE BREEZE_CARD.Number = CONFLICT.Number)";
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		var cardResult = result;
		var sql = "SELECT Name, StopID, EnterFare, IsTrainStation FROM STATION WHERE StopID = '" + stationID + "'";
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			var value = cardResult[0].Value;
			var fare = result[0].EnterFare
			if (value < fare) {
				req.session.messageQ.push('Not enough funds for ride');
				res.redirect('/passenger_main');
			} else {
				sql = "INSERT INTO TRIP (CurrentFare, StartTime, StartsStopID, Number) VALUES (" + fare + ", '" + timestamp + "', '" + stationID + "', '" + cardnum + "')";
				console.log(sql);
				var query = db.query(sql, (err, result) => {
					if(err) throw err;
					sql = "UPDATE BREEZE_CARD SET Value = " + (value - fare) + " WHERE Number = '" + cardnum + "'";
					console.log(sql);
					var query = db.query(sql, (err, result) => {
						if(err) throw err;
						res.redirect('/passenger_main');
					});
				});
			}
		});
	});
});

// app.get('/starttrip', function(req, res){
// 	console.log("GET /starttrip");
// 	var timestamp = moment().format('YYYY/MM/DD HH:mm:ss');
// 	var stationID = req.query.startid;
// 	var cardnum = req.query.cardnum;
// 	sql = "SELECT Username, Value FROM BREEZE_CARD WHERE Number = '" + cardnum + "' AND NOT EXISTS (SELECT * FROM CONFLICT WHERE BREEZE_CARD.Number = CONFLICT.Number)";
// 	var query = db.query(sql, (err, result) => {
// 		if(err) throw err;
// 		cardResult = result;
// 		var sql = "SELECT Name, StopID, EnterFare, IsTrainStation FROM STATION WHERE StopID = '" + stationID + "'";
// 		var query = db.query(sql, (err, result) => {
// 			if(err) throw err;
// 			var value = cardResult[0].Value;
// 			var fare = result[0].EnterFare
// 			if (value < fare) {
// 				req.session.messageQ.push('Not enough funds for ride');
// 				res.redirect('/passenger_main');
// 			} else {
// 				sql = "INSERT INTO TRIP (CurrentFare, StartTime, StartsStopID, Number) VALUES (" + fare + ", " + timestamp + ", '" + stationID + "', '" + cardnum + "')";
// 				console.log(sql);
// 				var query = db.query(sql, (err, result) => {
// 					if(err) throw err;
// 					res.redirect('/passenger_main');
// 				});
// 			}
// 		});
// 	});
// });

app.get('/endtrip', function(req, res){
	console.log("GET /endtrip");
	var endID = req.query.endid;
	var startID = req.query.startid;
	var cardnum = req.query.cardnum;
	// See if it is train-train or bus-bus
	var sql = "SELECT IsTrainStation FROM STATION WHERE StopID = '" + endID + "'";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		var endIsTrain = result[0].IsTrainStation;
		console.log("End is train? " + endIsTrain);
		var sql = "SELECT IsTrainStation, EndsStopID, StartTime FROM STATION s JOIN TRIP t ON s.StopID = t.StartsStopID WHERE StartsStopID = '" + startID + "' AND Number = '" + cardnum + "'";
		console.log(sql);
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			console.log(result);
			var canExit = false;
			var timestamp = null;
			result.forEach(function(station){
				if(!station.EndsStopID && station.IsTrainStation == endIsTrain) {
					canExit = true;
					timestamp = station.StartTime;
				}
			});
			timestamp = moment(timestamp);
			upperTime = timestamp.add(1, 'seconds').format('YYYY/MM/DD HH:mm:ss')
			lowerTime = timestamp.add(-2, 'seconds').format('YYYY/MM/DD HH:mm:ss')
			var exitType = endIsTrain == true ? "bus" : "train";
			if (canExit) {
				console.log("range: " + upperTime + " --- " + lowerTime)
				sql = "UPDATE TRIP SET EndsStopID = '" + endID + "' WHERE StartTime < '" + upperTime + "' AND StartTime > '" + lowerTime + "' AND Number = '" + cardnum + "'";
				console.log(sql);
				var query = db.query(sql, (err, result) => {
					if(err) throw err;
					console.log(result);
					req.session.messageQ.push("Successfully exited " + exitType);
					res.redirect('/passenger_main');
				});
			} else {
				req.session.messageQ.push("Can't get off at this station, you must exit on a " + exitType);
				res.redirect('/passenger_main');
			}
		});
	});
});

app.get('/passenger_cardmanage', function(req, res){
	console.log("GET /passenger_cardmanage");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/');
		return
	}

	var username = req.session.username;

	var sql = "SELECT Number, Value FROM BREEZE_CARD WHERE Username = '" + username + "' AND NOT EXISTS (SELECT * FROM CONFLICT WHERE BREEZE_CARD.Number = CONFLICT.Number)";
	var query = db.query(sql, (err, result) => {
		req.session.cardCount = result.length;
		console.log('passenger_cardmanage')
		messages = getMessages(req);
		res.render('passenger_cardmanage', {
			messages: messages,
			cards: result
		});
	});
});

app.post('/passenger_main', function(req, res){
	res.redirect('/passenger_main');
});

app.get('/removecard', function(req, res){
	console.log("GET /removecard");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/')
		return
	}

	var cardnum = req.query.cardnum;
	if (req.session.cardCount && req.session.cardCount > 1 ) {
		var sql = "UPDATE BREEZE_CARD SET Username = NULL WHERE Number = '" + cardnum + "'";
		console.log(sql);
		var query = db.query(sql, (err, result) => {
			if(err) throw err;
			req.session.messageQ.push("Successfully deleted card " + cardnum);
			res.redirect('/passenger_cardmanage');
		});
	} else {
		req.session.messageQ.push("Action failed. Every user is required to have at least one Breeze Card");
		res.redirect('/passenger_cardmanage');
	}

});

app.post('/addcard', function(req, res) {
	console.log("POST /addcard");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/')
		return;
	}
	var cardnum = req.body.cardnum[0];
	console.log("cardnum: " + cardnum);
	if (isNaN(cardnum) || cardnum.length != 16) {
		req.session.messageQ.push("Invalid card format. Please use exactly 16 digits");
		res.redirect('/passenger_cardmanage');
		return;
	}
	var username = req.session.username;
	var sql = "SELECT Number FROM BREEZE_CARD WHERE Username = '" + username + "'";
	console.log(sql);
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		var alreadyOwns = false;
		result.forEach(function(card) {
			if (card.Number == cardnum) alreadyOwns = true;
		});
		if (alreadyOwns) {
			req.session.messageQ.push("You already have this card silly goose");
			res.redirect('/passenger_cardmanage');
			return
		} else {
			var sql = "SELECT Username FROM BREEZE_CARD WHERE Number = '" + cardnum + "'";
			var query = db.query(sql, (err, result) => {
				if(err) throw err;
				if (result.length == 0) {
					// Create new breeze card
					var sql = "INSERT INTO BREEZE_CARD (Number, Value, Username) VALUES ('" + cardnum + "', " + 0 + ", '" + username + "')";
					console.log(sql);
					var query = db.query(sql, (err, result) => {
						if(err) throw err;
						console.log("Created BREEZE_CARD: '" + cardnum + "', '" + username + "");
						req.session.messageQ.push("Created breeze card " + cardnum);
						res.redirect('/passenger_cardmanage');
						return;
					});
				} else if (result[0].Username) {
					var oldUser = result[0].Username;
					sql = "INSERT IGNORE INTO CONFLICT (DateTime, Username, Number) Value ('" + moment().format('YYYY/MM/DD HH:mm:ss') + "', '" + username + "', '" + cardnum + "')";
					console.log(sql);
					var query = db.query(sql, (err, result) => {
						if(err) throw err;
						req.session.messageQ.push("Conflict added for card " + cardnum);
						res.redirect('/passenger_cardmanage');
						return;
					});
				} else {
					sql = "UPDATE BREEZE_CARD SET Username = '" + username + "' WHERE Number = '" + cardnum + "'";
					console.log(sql);
					var query = db.query(sql, (err, result) => {
						if(err) throw err;
						req.session.messageQ.push("User added as owner of existing card " + cardnum);
						res.redirect('/passenger_cardmanage');
						return;
					});
				}
			});
		}
	});
});

app.post('/addcardvalue', function(req, res) {
	console.log("POST /addcardvalue");
	var cardnum = req.body.cardnum[1];
	var value = req.body.cardval;
	var ccnum = req.body.ccnum;
	console.log("cardnum: " + cardnum + "\nvalue: " + value + "\nccnum: " + ccnum);
	if (!cardnum) {
		req.session.messageQ.push("select a dang card");
		res.redirect('passenger_cardmanage');
		return;
	}
	if (isNaN(ccnum) || ccnum.length != 16) {
		req.session.messageQ.push("invalid credit card number. 16 digits fool");
		res.redirect('passenger_cardmanage');
		return;
	}
	if (isNaN(value) || value < 0) {
		req.session.messageQ.push("invalid input. positive number");
		res.redirect('passenger_cardmanage');
		return;
	}
	var sql = "SELECT Value FROM BREEZE_CARD WHERE Number = '" + cardnum + "'";
	var query = db.query(sql, (err, result) => {
		if(err) throw err;
		var currVal = result[0].Value;
		currVal = parseFloat(currVal);
		value = parseFloat(value);
		console.log("current value: " + currVal)
		console.log("new value: " + value)
		var total = currVal + value;
		console.log("total value: " + total)
		if (total < 0 || total > 1000) {
			req.session.messageQ.push("card exceeds limits");
			res.redirect('passenger_cardmanage');
			return;
		} else {
			sql = "UPDATE BREEZE_CARD SET Value = " + total + " WHERE Number = '" + cardnum + "'";
			var query = db.query(sql, (err, result) => {
				if(err) throw err;
				req.session.messageQ.push("$" + value + " added to your card!");
				res.redirect('passenger_cardmanage');
				return;
			});
		}
	});
});

app.get('/passenger_triphistory', function(req, res){
	console.log("GET /passenger_triphistory");
	if (req.session == null) {
		return res.status(401).send();
	}
	if (!req.session.user) {
		res.redirect('/')
		return
	}

	console.log('passenger_triphistory')
	res.render('passenger_triphistory', {
	});
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
});