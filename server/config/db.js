const mongoose = require('mongoose');

const connectDB = async () => {

    try{
        await mongoose.connect(process.env.mongoURI);
        console.log('MongoDB is running...');
    }catch(err){
        console.error(err.message);
        //Exit process with failure if db doesn't connect
        process.exit(1);
    }
}

module.exports = connectDB;