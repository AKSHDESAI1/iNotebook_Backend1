import jwt from "jsonwebtoken";

const JWT_SECRET = "Harryisagoodb$oy";

const fetchUser = async (req, res, next) => {
    // Get the user from the jwt token and add id to red object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ "error": "please authenticates using a valid token1." });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log("req.user", req.user);
        console.log("data", data);
        req.user = data.user
        console.log("req.user", req.user);
        next();
    } catch (error) {
        res.status(401).send({ "error": "please authenticates using a valid token2." });
    }
};

export default fetchUser;