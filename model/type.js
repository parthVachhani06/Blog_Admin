const mongoose = require('../config/db')
const typeschema = new mongoose.Schema({
    typeName : {
        type: String,
        required: true,
        unique: true
    }

})

const typemodel = mongoose.model("types", typeschema);

module.exports = typemodel;

