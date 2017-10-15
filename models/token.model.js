const mongoose = require('mongoose');
const schema = mongoose.Schema;

const TokenSchema = schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: this.createdAt
    },
    addedBy: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    popularity: {
        votes: [
            schema.Types.ObjectId
        ],
        count: 0,
        default: 0
    },
    originDate: {
        type: Date
    },
    description: {
        type: String
    }

});

TokenSchema.pre('save', function(next) {
    const now = new Date();
    this.updatedAt = now;
    this.popularity.count = 0;

    if (!this.createdAt) {
        this.createdAt = now();
    }
    next();
})


const TokenModel = mongoose.model('tokens', TokenSchema);
module.exports = TokenModel;