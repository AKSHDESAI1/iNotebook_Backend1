import mongoose from "mongoose";

// const mongoURI = "mongodb://localhost:27017";
const mongoURI = "mongodb+srv://aksh2137:aksh2137@cluster0.jpqpxva.mongodb.net/test";

const connectToMongo = async () => {
    const dbOptions = {
        dbName: "iNotebook"
    }
    await mongoose.connect(mongoURI, dbOptions, () => {
        console.log("Connected to Mongo Successfully.")
    });
};

export default connectToMongo;