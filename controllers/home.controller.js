const express = require('express');
const router = express.Router();

//==| GET ||==> GET INDEX-VIEW
router.get('/', (req, res, next) => {
    let currentUser = req.user;
    let message = null;

    if (currentUser === null) {
        message = 'Please Sign-In or Register';
    }
    return res.render('index', { message, currentUser } );
})




module.exports = router;