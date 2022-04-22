const mongoose = require('mongoose');
const URI = "mongodb+srv://converter:converter@cluster0.hdert.mongodb.net/converter?retryWrites=true&w=majority";
const connectDb = async ()=>{
    await mongoose.connect(URI)
    console.log('Db is successfully connected.....!');
    
}

module.exports = connectDb;