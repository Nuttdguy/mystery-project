const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jsonWebToken = require('jsonwebtoken');
const shortid = require('short-id');
const fileUpload = require('express-fileupload');


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
        isNotNullItem: function(item) {
            console.log(item + '==== ITEM');
            if (item === null || item === '' || item === {}) {
                return;
            }
            return item;
        },
        formatDate: function(tokenData) {
            let d = tokenData.getMonth() 
                + ' ' + tokenData.getDate() 
                + ' ' + tokenData.getFullYear();
            return d;
        },
        tallyCount: function(tokenData) {
            if (tokenData == null) {
                return tokenData;
            }
            return tokenData.count - tokenData.downCount;
        },
        tallyVotes: function(tokenData) {
            if (tokenData == null) {
                return tokenData;
            }
            return tokenData.count + tokenData.downCount;
        }
    }
});

// contructVotersTable: function(tokenData) {
//     let html = '';
//     for (let i = 0; i < tokenData.popularity.votes.length; i++ ) {
//         user = tokenData.popularity.votes[i];
//         count = tokenData.popularity.count;
//         downVote = tokenData.popularity.downCount;
//         total =  tokenData.popularity.count + tokenData.popularity.downCount;
//         html += "<tr><td>"+ user + "</td>" +
//         "<td>"+ count + "</td>" +
//         "<td>"+ downVote + "</td>" +
//         "<td>"+ total + "</td></tr>";
//     }
//     return html;
// },

// set configuration for Express 
app.engine('.hbs', handlebars.engine );
app.set('view engine', '.hbs');
app.use(express.static( './public' ));
// app.use(express.static('./public/uploads'));

// configure middleware
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(methodOverride('_method'));

// use middle - utilize cookies for managing user authentication
app.use(cookieParser());

app.use( function(req, res, next) {
    console.log('Authenticating user with middleware');

    if (typeof req.cookies.jwtToken === 'undefined' || req.cookies.jwtToken === null) {
        req.user = null;
    } else {
        let token = req.cookies.jwtToken;
        let decodedToken = jsonWebToken.decode(token, {complete: true}) || {};
        req.user = decodedToken.payload;
    }
    next();
});

// controller routes
const homeRoutes = require('./controllers/home.controller');
const authRoutes = require('./controllers/auth.controller');
const tokenRoutes = require('./controllers/token.controller');

// define routes to use
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/token', tokenRoutes);



// set port number
const portNumber = process.env.PORT || 3000
// start application
app.listen( portNumber, () => {
    console.log('Application is running on port === ' + portNumber);
});

module.exports = app;
