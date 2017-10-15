const express = require('express');
const router = express.Router();
const TokenModel = require('../models/token.model');


//===========================================================
//===================  GET ROUTES =======================
//===========================================================


//==| GET ||==> GET ADD TOKEN PAGE
router.get('/t', (req, res, next) => {
    let currentUser = req.user;

    if (!currentUser) {
        return res.status(401).redirect('/login');
    }

    return res.render('token', {currentUser} );
})

//==| GET ||==> GET SINGLE TOKEN DETAIL
router.get('/t/:tokenName', (req, res, next) => {
    let currentUser = req.user;

    TokenModel.findOne({name: req.params.tokenName}, function(err, tokenData) {
        if (err) {
            return res.status(401).redirect('/'); 
        }
        return res.render('token-detail', { currentUser, tokenData });
    });

});


//===========================================================
//==================  POST ROUTES =======================
//===========================================================


//==| POST ||==> ADD TOKEN TO DB
router.post('/t', (req, res, next) => {
    let currentUser = req.user;
    let tokenData = new TokenModel(req.body);
    tokenData.addedBy = currentUser.username;

    if (!currentUser) {
        return res.status(401).send('/login');
    } else {

        // check if token already exist
        TokenModel.findOne({name: tokenData.name}, (err, data) => {
            if (err) {
                const message = 'Something happened';
                return res.status(401).render('./errors/token-err', {err, message});
            }
            return data;
        }).then( (data) => {
            if (data === null) {
                tokenData.save( function(err) {
                    if (err) {
                        const message = 'Token could not be added';
                        return res.status(401).render('/', {err, message})
                    } 
                })
            }
        }).catch( (err) => {
            const message = 'Unknown error occurred';
            return res.status(500).render('./errors/token-err', {err, message});
        })
        return res.redirect('/');
    }
})






//===========================================================
//==================  UPDATE ROUTES =======================
//===========================================================





//===========================================================
//==================  DELETE ROUTES =======================
//===========================================================


module.exports = router;