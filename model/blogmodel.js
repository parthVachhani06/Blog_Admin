const mongoose = require("mongoose")
const blogschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    rate: {
        type: String,
        required: true,
    },
    typeName: {
        type: String,
        required: true,
    },  
    blogImg: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
    },
    typeid : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "types"
    }


})

const blogmodel = mongoose.model("blogs", blogschema);

module.exports = blogmodel;
