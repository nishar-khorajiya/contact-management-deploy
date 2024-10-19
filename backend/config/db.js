//Mongodb database connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://21CE057:Nis1933@cluster0.jsyov.mongodb.net/contact_management_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // console.log('MongoDB Connected');
    } catch (error) {
        // console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
