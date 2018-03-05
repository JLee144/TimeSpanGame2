var express = require('express');
var path = require('path');
var open = require('open');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var database = require('../src/Database/databaseHandler.js');

var port = 3500;
var app = express();
database.connect();
var userId = ""; 
app.set('port', process.env.PORT || 8081);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
    cookieName: 'session',
    secret: 'sfdsfdgfsg435436',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
  }));



  app.use(async function(req, res, next) {
    if (req.session && req.session.userId) {
         var user = await database.getUserById(req.session.userId); 
        if (user) {
          req.userId = user.UserID;
          req.session.userId = user.UserID;  //refresh the session value
          res.locals.userId = user.UserID;
        }
        // finishing processing the middleware and run the route
        next();
    } else {
      next();
    }
  });


  function requireLogin (req, res, next) {
    if (!req.userId) {
      res.redirect('/');
    } else {
      next();
    }
  };

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../src/index.html'))
});

app.get('/main', requireLogin, function(req, res) {

  
    res.sendFile(path.join(__dirname, '../src/main.html'))
});

app.get('/timespanMenu', requireLogin,  async function(req, res) {
    
   var menuResults = await database.getTimeSpanMenuData(); 
   res.json(menuResults);
});


app.get('/checkIfUserPlayed', requireLogin,  async function(req, res) {
    
    var result = await database.checkUserPlayedToday(req.userId); 
    res.json(result);
 });

app.post('/saveTimeSpan', requireLogin,  async function(req, res) {
    
     await database.saveTimeSpan(req.userId); 
     res.json( '/main');
 });

app.post('/SubmitLogin', async function(req,res) {
    debugger; 
    var username= req.body.UserName;
    var password= req.body.Password;
    
    
    var userLoginResult = await database.userLogin(username, password); 

   
    if(userLoginResult)
    {
        req.session.userId = userLoginResult;
        res.redirect( '/main');
    }
    else
    {
       
        res.redirect( '/?Error=true');
    }

})

app.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else {
        open('http://localhost:' + port);
    }
});

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); 
//redirect bootstrap JS 
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap