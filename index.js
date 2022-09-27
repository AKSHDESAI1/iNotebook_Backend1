import express from "express";
import connectToMongo from "./db.js";
import router from "./routes/auth.js";
import router1 from "./routes/notes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    "origin": "*"
}))

connectToMongo();

app.use(express.json())

// Available Routes 
app.use("/api/auth", router);
app.use("/api/notes", router1);

app.get('/', (req, res) => {
    res.send("<h1> Hello Aksh </h1>");
})

app.listen(PORT, () => {
    console.log(`iNotebook Backend is running on ${PORT} Port.`);
})