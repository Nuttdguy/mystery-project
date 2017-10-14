const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jsonWebToken = require('jsonwebtoken');

// create an instance of express class
const app = express();

// configure database connection string
mongoose.connect('mongodb://localhost/coinup', { useMongoClient: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
mongoose.Promise = global.Promise;

// configure handlebars template framework
const handlebars = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {

    }
});

// set configuration for Express 
app.engine('.hbs', handlebars.engine );
app.set('view engine', '.hbs');
app.use(express.static('./public'));

// configure middleware
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(methodOverride('_method'));

const checkAuth = function(req, res, next) {
    console.log('Authenticating user with middleware');
    let token = req.cookies.jwtToken;

    if (typeof req.cookies.jwtToken === 'undefined' || req.cookies.jwtToken === null) {
        req.user = null;
    } else {
        let decodedToken = jsonWebToken.decode(token, {complete: true}) || {};
        req.user = decodedToken.payload;
    }
    next();
}

// use middle - utilize cookies for managing user authentication
app.use(cookieParser());
app.use(checkAuth);

// controller routes
const homeRoutes = require('./controllers/home.controller');
const authRoutes = require('./controllers/auth.controller');

// define routes to use
app.use('/', homeRoutes);
app.use('/', authRoutes);



// set port number
const portNumber = process.env.PORT || 3000
// start application
app.listen( portNumber, () => {
    console.log('Application is running on port === ' + portNumber);
});



