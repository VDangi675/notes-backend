const express = require("express")
const bodyparser = require("body-parser")
const User = require("../modules/User")
const { body, validationResult } = require("express-validator")
const bcrypt = require("bcrypt")

const route = express.Router()

const jwt = require("jsonwebtoken")



route.get("/", (req, res) => {
    res.send("ok google")
})


route.post("/SIGNUP",
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("Confirmpassword").isLength({ min: 8 }), async (req, res) => {
        try {

            let { email, password, Confirmpassword } = req.body;

            if (password !== Confirmpassword) {
                return res.json({ err: "password and Confirmpassword does not match" })
            }

            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.json({ err: "password length should be 8" })
            }



            let user = await User.findOne({ email })

            if (user) {
                return res.json({ message: "User is already Exists" })
            }


            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                user = await User.create({
                    email: email,
                    password: hash
                })
                res.status(200).json({
                    user,
                    message: "Account is Created"
                })

            })


        } catch (e) {
            res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
    })

route.post("/SIGNIN",
    body("email").isEmail(), async (req, res) => {
        try {

            let { email, password } = req.body;

            let errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.json({ err: "email is not valid" })
            }

            let user = await User.findOne({ email })

            if (!user) {
                return res.json({ message: "User does Exists" })
            }

            bcrypt.compare(password, user.password, async function (err, result) {
                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    })
                }
                if (result) {
                    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                    res.status(200).json({ user, token, message: "Logged In Sucessfully" })
                } else {
                    if (password !== user.password) {
                        return res.json({ err: "invalid password" })
                    }
                }

            })





        } catch (e) {
            res.status(500).json({
                status: "Failed",
                message: e.message
            })
        }
    })



module.exports = route