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
        return res.status(401).redirect('/auth/login');
    }

    return res.render('token', {currentUser} );
})


//==| GET ||==> GET SINGLE TOKEN DETAIL
router.get('/t/:tokenName', (req, res, next) => {
    let currentUser = req.user;
    let isNotEdit = true; // enable or disable temaplate form for edit

    TokenModel.findOne({name: req.params.tokenName}, function(err, tokenData) {
        if (err) {
            return res.status(401).redirect('/'); 
        }
        return res.render('token-detail', { currentUser, tokenData, isNotEdit });
    });

});


router.get('/t/:tokenId/edit', (req, res, next) => {
    let currentUser = req.user;
    let isNotEdit = false;

    TokenModel.findOne({_id: req.params.tokenId}, function(err, tokenData) {
        if (err) {
            return res.status(401).redirect('/'); 
        }
        return res.render('token-detail', { currentUser, tokenData, isNotEdit });
    });

})

//===========================================================
//==================  POST ROUTES =======================
//===========================================================


//==| POST ||==> ADD TOKEN TO DB
router.post('/t', (req, res, next) => {
    let currentUser = req.user;
    let tokenData = new TokenModel(req.body);
    tokenData.addedBy = currentUser.username;

    if (!currentUser) {
        return res.status(401).send('/auth/login');
    } else {

        // check if token already exist
        TokenModel.findOne({name: tokenData.name}, (err, data) => {
            if (err) {
                const message = 'Something happened';
                return res.status(401).render('./errors/token-err', {err, message});
            }
            return data;
        }).then( (data) => {
            if (data.name !== tokenData.name) {
                tokenData.save( function(err) {
                    if (err) {
                        const message = 'Token could not be added';
                        return res.status(401).render('/', {err, message})
                    } 
                })
            } 
            // TODO QUESTION: WHY DOES THIS NOT WORK, AUTH MIDDLEWARE CAUSING 
            // CANNOT SET HEADER ERROR

            // else {
            //     const message = 'Unknown error occurred';
            //     return res.render('./errors/token-err', {message}); 
            // }

        }).catch( (err) => {
            const message = 'Unknown error occurred';
            return res.status(500).render('./errors/token-err', {err, message});
        })
        return res.redirect('/');
    }
});






//===========================================================
//==================  UPDATE ROUTES =======================
//===========================================================


router.put('/t/:tokenId/edit', (req, res, next) => {
    let currentUser = req.user;
    let tokenModel = new TokenModel(req.body);

    TokenModel.findByIdAndUpdate(req.params.tokenId, 
            { $set: { 
                updatedAt: new Date(),
                name: tokenModel.name,
                addedBy: tokenModel.addedBy,
                imageUrl: tokenModel.imageUrl,
                originDate: tokenModel.originDate,
                description: tokenModel.description }
            }, (err) => {
        if (err) {
            return res.status(401).redirect('/');  
        }
        return res.redirect('/');
    })

})


//===========================================================
//==================  DELETE ROUTES =======================
//===========================================================


router.delete('/t/:tokenId/delete', (req, res, next) => {
    let currentUser = req.user;
    let tokenModel = new TokenModel(req.body);

    TokenModel.deleteOne({_id: req.params.tokenId}, (err) => {
        if (err) {
            return res.status(401).redirect('/');  
        }
        return res.redirect('/');
    })
})


module.exports = router;