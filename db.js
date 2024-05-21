const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

function connectDB(){

    mongoose.connect("mongodb+srv://mohit20:mohit1627@cluster1.mazsr4t.mongodb.net/carmate" , {useUnifiedTopology: true , useNewUrlParser: true})

    const connection = mongoose.connection

    connection.on('connected' , ()=>{
        console.log('Mongo DB Connection Successfull')
    })

    connection.on('error' , ()=>{
        console.log('Mongo DB Connection Error')
    })


}

connectDB()

module.exports = mongoose