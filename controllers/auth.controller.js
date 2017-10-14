const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


//==| GET ||==> GET REGISTRATION 
router.get('/register', (req, res, next) => {
    return res.render('register');
});

//==| GET ||==> GET LOGIN
router.get('/login', (req, res, next) => {
    return res.render('login');
})

//==| GET ||==> GET LOGOUT
router.get('/logout', (req, res, next) => {
    res.clearCookie('jwtToken');
    res.clearCookie('user');
    return res.redirect('/login');
})

//==| POST ||==> FOR REGISTERING NEW USER
router.post('/register', (req, res, next) => {

    // create new user object with form content as body
    let newUser = new UserModel(req.body);

    // check if email matches, if not, send error
    let email = newUser.email;
    if (req.body.password != req.body.password_verify) {
        const message = 'Passwords do not match';
        return res.status(401).render('./errors/register', { message });
    }

    UserModel.findOne({email: email}).exec( (err, userData) => {
        if (err) {
            return res.status(404).send(err);
        } else {
            if (userData === null || email !== userData.email ) {
                newUser.save( function(err) {
                    console.log('Saved new user');
                    if (err) return res.status(401).send(err);
                    
                    res.cookie('jwtToken', 
                                jwt.sign({_id: newUser._id, username: newUser.username}, 'SEED', {expiresIn: '60 days'}), 
                                {maxAge: 900000, httpOnly: true})
                    return res.redirect('/login');
                })
            } else {
                const message = 'Email is already registered, please login';
                return res.status(401).render('./errors/register', { message });
            }
        }
    })
});

//==| POST ||==> FOR LOGGING IN USER
router.post('/login', (req, res, next) => {
    let formBody = new UserModel(req.body);
    
    UserModel.findOne( {email: formBody.email}, {}, (err, userData) => {
        if (err) {
            const message = 'Email or password is invalid';
            return res.status(401).render('./errors/login-err', { message });
        } else {
            // the returned result is a mongoose object
            return userData;
        }
    }).then( (userData) => {
        userData.comparePassword(formBody.password, function(err, isMatch) {
            if (!isMatch) {
                const message = 'Email or password is invalid';
                return res.status(401).render('./errors/login-err', { message });
            } else {
                res.cookie('jwtToken', 
                            jwt.sign({_id: userData._id, username: userData.username}, 'SEED', {expiresIn: '60 days'}), 
                            {maxAge: 900000, httpOnly: true})
                res.redirect('/');
            }
        })
    }).catch( (err) => {
        const message = 'Email or password is invalid';
        return res.status(401).render('./errors/login-err', { message });
    })

});


//==| UPDATE/PUT ROUTES




//==| DELETE ROUTES




module.exports = router;