import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: { type: String, required: true },
    description: { type: String, required: true},
    tag: { type: String, default: "General" },
    date: { type: Date, default: Date.now },
})


const Notes = mongoose.model("note", notesSchema)
export default Notes;