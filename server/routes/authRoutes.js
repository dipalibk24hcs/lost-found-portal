const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// REGISTER USER
// ======================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        // Check if user already exists
        let user =
            await User.findOne({
                email
            });


        if (user) {

            return res.status(400).json({
                message: "User Already Exists"
            });

        }


        // Create new user
        user = new User({

            name,
            email,
            phone,
            password

        });


        // Hash password
        const salt =
            await bcrypt.genSalt(10);


        user.password =
            await bcrypt.hash(
                password,
                salt
            );


        // Save user
        await user.save();


        res.status(201).json({

            message:
                "Registration Successful"

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        res.status(500).json({

            message:
                "Server Error"

        });

    }

});


// ======================================================
// LOGIN USER
// ======================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Find user
        const user =
            await User.findOne({
                email
            });


        if (!user) {

            return res.status(400).json({

                message:
                    "Invalid Credentials"

            });

        }


        // Compare password
        const match =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!match) {

            return res.status(400).json({

                message:
                    "Invalid Credentials"

            });

        }


        // JWT payload
        const payload = {

            user: {

                id:
                    user._id.toString(),

                role:
                    user.role || "user"

            }

        };


        // Generate token
        jwt.sign(

            payload,

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            },

            (error, token) => {

                if (error) {

                    console.error(
                        "JWT Error:",
                        error
                    );


                    return res.status(500).json({

                        message:
                            "Token Generation Failed"

                    });

                }


                res.json({

                    token

                });

            }

        );


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        res.status(500).json({

            message:
                "Server Error"

        });

    }

});


// ======================================================
// GET ALL USERS - ADMIN ONLY
// ======================================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const users =
                await User
                    .find()
                    .select("-password");


            res.json(users);


        } catch (error) {

            console.error(
                "Get Users Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);
// ======================================================
// DELETE USER - ADMIN ONLY
// ======================================================

router.delete(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const userId =
                req.params.id;


            // Prevent admin from deleting themselves
            if (
                userId === req.user.id
            ) {

                return res.status(400).json({

                    message:
                        "You Cannot Delete Your Own Account"

                });

            }


            const user =
                await User.findById(
                    userId
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            await User.findByIdAndDelete(
                userId
            );


            res.json({

                message:
                    "User Deleted Successfully"

            });


        } catch (error) {

            console.error(
                "Delete User Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);

// ======================================================
// GET LOGGED-IN USER PROFILE
// ======================================================

router.get(
    "/profile",
    authMiddleware,
    async (req, res) => {

        try {

            const user =
                await User
                    .findById(
                        req.user.id
                    )
                    .select("-password");


            if (!user) {

                return res.status(404).json({

                    message:
                        "User Not Found"

                });

            }


            res.json(user);


        } catch (error) {

            console.error(
                "Profile Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;
