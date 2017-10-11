// Set up
// create our app w/ express
var mongoose = require('mongoose');
//Using bluebird to avoid mongoose promises
mongoose.Promise = require("bluebird");
// mongoose for mongodb

//Changing This order might affect the rendering 
var express = require('express');
var app = express();
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)\
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var expressValidator = require('express-validator');

//Importing models
var Payments = require('./models/Payment.model');

//JWT
//var jwt = require('jsonwebtoken');
//var expressJwt = require('express-jwt');
var config = require('./config'); // get our config file

//var router = express.Router();              // get an instance of the express Router

//Connecting to mongoose 
mongoose.connect(config.database);

//setting the dynamic port
app.set('port', (process.env.PORT || 8081));
app.use(express.static(__dirname + '/public'));


//app.use(expressJwt({ secret: config.secret }).unless({ path: ['/login'] }))
//app.set('superSecret', config.secret); // secret variable
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(expressValidator());
app.use(methodOverride());
app.use(cors());

//Solves CROSS errors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/payments', (req, res) => {
    Payments.find({}, (error, data) => {
        if (error) {
            consoe.log(error);
            res.json(error);
        } else {
            console.log(data);
            res.json(data);
        }
    }).sort({date: -1});
});

/* with a promies
app.get('/get/teachers/all', (req, res) => {
    Teachers.find({}).then(data => {
        // handle data
    })
    .then(
        // Another function
    )
    .catch(err => {
        // handle error
    })
});/**/

app.post('/pay', (req, res) => {
    console.log (req.body);

    const amount = req.body.amount;
    const date = req.body.date;

    var addPayment = new Payments({
        amount: amount,
        date: date
    });

    addPayment.save((err, data) => {
        if (err){
            console.log(err);
        } else{
            res.status(201).send(data);
        }
    });

});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
