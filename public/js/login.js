
function func(element) {
	
}

function login(element) {
	var un = $('#username-input').val();
	var pw = $('#password-input').val();
	alert("username: " + un + "\npassword: " + pw);
}

function register(element) {
	window.location.replace("register.html");
}

$('#login-btn').on('mousedown', login);
$('#register-btn').on('mousedown', register);
$('#password').password('toggle');