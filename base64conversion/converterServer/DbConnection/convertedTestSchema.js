const mongoose = require('mongoose');
const Schema = mongoose.Schema
const converter_text = new Schema({
    userId:{
        type: String,
        required: true
    },
    convertedText:{
        type: String,
        require: true
        
    }
    
})
module.exports = Converter_Text = mongoose.model('converter_text', converter_text);