import express from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchUser from "../middlewares/fetchUser.js";

const router = express.Router();

const JWT_SECRET = "Harryisagoodb$oy";

// Route1:- Create a user using: POST "/api/auth/createUser". Doesn't require Auth
router.post("/createUser", [
    body('name', 'Min length is 5').isLength({ min: 5 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Min Length of password is 5').isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array(), success });
    }

    try {
        // Check Whether the user with email exists already
        let user = await User.findOne({ email: req.body.email });
        console.log("user", user)
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists.", success })
        }
        // const user1 = await User(req.body);
        // await user1.save();

        const salt = await bcrypt.genSalt(10);
        console.log("salt", salt);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        console.log('secPassword', secPassword);
        // const secPassword = req.body.password;

        const user1 = await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email
        })

        const data = {
            user: {
                id: user1.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log("jwtData", authtoken);
        // res.json(user1)
        success = true;
        res.json({ authtoken, success });

    } catch (error) {
        console.log(error)
        // res.json({
        //     "errors": "Email has already been taken. Please enter another one ",
        //     "message": error.message
        // })
        res.status(500).json({
            "error": "Internal Server Error"
        })
    }
})


// Route 2:- Authenticate a User using POST "/api/auth/login". No Login Required
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ "error": "Please try to login with Correct Credentials.", success });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(404).json({ "error": "Wrong Password. PLease Try Again", success });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log("jwtData", authtoken);
        // res.json(user1)
        success = true;
        res.json({ authtoken, success });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// Route 3:- Get loggedin User Details using: POST "/api/auth/getUser". Login required
router.post("/getUser", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.log('error1', error.message);
        res.status(500).send("Internal Server Error");
    }
})

export default router;