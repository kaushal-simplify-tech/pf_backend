const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    name:{
        type: String,
    },
    identifier:{
        type: String,
        unique: true,
    }
});

module.exports = mongoose.model('Module', moduleSchema)
