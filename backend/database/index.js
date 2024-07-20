import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        })
        console.log("Connected to database -> MongoDB succesfully");
    }
    catch (error) {
        console.log(`The following error occured while connecing to database: ${error}`);
    }
};

export default ConnectDB;