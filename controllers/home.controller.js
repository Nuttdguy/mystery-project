const express = require('express');
const router = express.Router();
const TokenModel = require('../models/token.model');

//==| GET ||==> GET INDEX-VIEW
router.get('/', (req, res, next) => {
    let currentUser = req.user;
    let message = null;

    if (!currentUser) {
        message = 'Please Sign-In or Register';
    }

    // render token for sidebar
    TokenModel.find({}).exec( function(err, tokenData) {
        return res.render('index', { message, currentUser, tokenData } );
    });

})


module.exports = router;