var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser')
var app = express();


app.use(bodyParser.json());
//middleWare must go on top of your file.
//the next callback must be called in order for the function to run
//for the other get requests besides the 1st (almost like looping)
app.post('/save', function(request, response){
	response.send('save request received');
	console.log('you posted some shit');
})
app.use(function(request, response, next){
	var query = request.query;

	if(Object.keys(query).length > 0){
		response.status(400).send('You cant use query strings');
	}else{
		next();
	}
});

app.use(function(request, response, next){
	var now = new Date();
	var today = now.toUTCString();
	
	var myContent = `this is the original request ${request.originalUrl} and the time ${today} \n`;

	fs.appendFile('./log.txt', myContent,function(err){
		if(err){ throw err};

		console.log('wrote the file')
	})
	next();
});

app.get("/hello/world", function(request, response) {
	// set tells the server what kind of content type you want response to send
		// response.set('Content-type', 'text/plain');
		// response.send('<h1>hello there</h1>');
	// you can also send back an json object by passing an array or object
	// express automatically turns you js object/array to json

		// response.send({message: 'hello world'});

	//if you want to know if your routing to this page is working

		console.log('got request to /hello/world');
})

// routing with params/dynamic routing

app.get('/hello/:name', function(request, response){
	response.send(`Hello ${request.params.name}`)

});

app.get('/users/:id', function(request, response){
	var userId = request.params.id;
	console.log(`got request for '/users/${userId}'`);
	//this object mimicks a database.Usually this would be stored in a database.
	var users = {
		1: 'Jon',
		2: 'Sandy',
		3: 'David'
	};
	response.send(`hello ${users[userId]}`);
});


//query strings
//return a friendly greeting for firstname and last name query params
//on the route /hi

//http://localhost:3000/hi?firstname=jeiner&lastname=noriega
app.get('/hi', function(request, response){
	var fName = request.query.firstname;
	var lName = request.query.lastname;

	response.send(`hi ${fName} ${lName}`);

})
app.get('/myword/:word',function(request, response){
	var reversedWord = request.params.word.split('').reverse().join('');
	response.send(`this is the reversed word ${reversedWord}`);
});

//this is a catch all for any route that doesn't exist
app.get('*', function(request, response){
	response.status(404).send('wrong page dummy');
});


app.listen(3000, function(){
	console.log('listening at port 3000');


});

