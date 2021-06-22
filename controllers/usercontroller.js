const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post("/register", async (req, res) => {

    let { username, passwordhash } = req.body;
    try {
        const User = await UserModel.create({
            username, 
            passwordhash: bcrypt.hashSync(passwordhash, 13)
        });
        
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(201).json({
            message: "User has been successfully registered!",
            user: User,
            sessionToken: token
        });
    
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                res.status(409).json({
                    message: "Email already in use",
                });
            } else {
                res.status(500).json({
                    message: "Failed to register user",
                });
            }
        }
});





module.exports = router;