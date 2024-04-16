const mongoose = require('../config/db')
const adminschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone : {
        type :Number,
        required : false
    },
    bio : {
        type : String,
        required : false

    },
    proImg : {
        type : String
    }


})

const adminmodel = mongoose.model("admins", adminschema);

module.exports = adminmodel;

