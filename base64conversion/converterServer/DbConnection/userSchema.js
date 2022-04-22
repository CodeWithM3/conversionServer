const mongoose = require('mongoose');
const Schema = mongoose.Schema
const user = new Schema({
    
    firstname:{
        type: String,
        required: true
       
    },
    lastname:{
        type: String,
        required: true
    
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
        
    },
    password2: {
        type: String, 
        required: true
        
    }
});
module.exports = User = mongoose.model('user', user)