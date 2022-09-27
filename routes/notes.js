import express from "express";
import fetchUser from "../middlewares/fetchUser.js";
import Notes from "../models/Notes.js";
import { body, validationResult } from "express-validator"

const router1 = express.Router();

// Route 1:- Get all the Notes using : GET "/api/notes/fetchallnotes". Login required
router1.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        res.status(500).json({
            "error": "Internal Server Error"
        })
    }
})

// Route 2:- Get all the Notes using : POST "/api/notes/addNote". Login required
router1.post("/addNote", fetchUser, [
    body('title', 'Min length of title is 3').isLength({ min: 3 }),
    body('description', 'Min Length of description is 5').isLength({ min: 5 })
], async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).json({
            "error": "Internal Server Error"
        })
    }
})

// Route 3:- Update an existing Notes using : PUT "/api/notes/updateNote". Login required
router1.put("/updateNote/:id", fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        //Create a newNote object
        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed") //Un-authorized
        };

        note = await Notes.findByIdAndUpdate(req.params.id, {
            $set: newNote
        }, { new: true })
        res.json({ note });
    } catch (error) {
        console.log("error", typeof error);
        console.log("error", error);
        console.log("error.message", error.message);
        res.json({ "error": error })
    }

})

// Route 4:- Delte an existing Notes using : DELETE "/api/notes/deleteNote". Login required
router1.delete("/deleteNote/:id", fetchUser, async (req, res) => {
    try {
        // Find the note to be delete and delete it.
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Allow Deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed"); //unAuthorized
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note })
    } catch (error) {
        res.status(500).send("internal server error");
    }
})
export default router1;