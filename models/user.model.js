const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    modifiedAt: {
        type: Date,
        default: this.createdAt
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        default: this.email
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

UserSchema.pre('save', function(next) {
    // create an instance of this user
    let user = this;
    user.username = this.email // default username to email

    // if the password is not modified, skip next middleware
    if (!user.isModified('password')) {
        return next();
    }

    // use bcrypt to encypt password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            return next();
        })
    })

});

// function compares password
UserSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    })
};


const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
