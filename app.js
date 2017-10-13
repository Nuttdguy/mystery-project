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
const mongodb = mongoose.connect('mongodb://localhost/coinup');
mongoose.Promise = global.Promise;

// configure handlebars template framework
const handlebars = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {

    }
});

// set configuration for Express 
app.engine('view-engine', handlebars.engine );
app.set('view-engine', '.hbs');
app.use(express.static('./public'));

// configure middleware
app.use(methodOverride('_method'));




