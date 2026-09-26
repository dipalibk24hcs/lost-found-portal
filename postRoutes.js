const adminMiddleware =
    require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

const authMiddleware =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/upload");


// =====================================================
// ADD POST WITH IMAGE
// =====================================================

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {

        try {

            console.log("POST BODY:", req.body);
            console.log("UPLOADED FILE:", req.file);


            const {
                type,
                title,
                category,
                location,
                description
            } = req.body;


            const image =
                req.file
                    ? req.file.filename
                    : "";


            const post =
                new Post({

                    userId:
                        req.user.id,

                    type:
                        type,

                    title:
                        title,

                    category:
                        category,

                    location:
                        location,

                    description:
                        description,

                    image:
                        image

                });


            await post.save();


            res.status(201).json({

                message:
                    "Post Added Successfully",

                post

            });


        } catch (error) {

            console.error(
                "Add Post Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET ALL POSTS
// =====================================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const posts =
    await Post.find()
        .populate(
            "userId",
            "name email phone"
        )
        .sort({
            createdAt: -1
        });

            res.json(posts);


        } catch (error) {

            console.error(
                "Get Posts Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);


// =====================================================
// GET MY POSTS
// =====================================================

router.get(
    "/my",
    authMiddleware,
    async (req, res) => {

        try {

            const posts =
                await Post.find({

                    userId:
                        req.user.id

                })
                .populate(
                    "userId",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


            res.json(posts);


        } catch (error) {

            console.error(
                "Get My Posts Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);


// =====================================================
// EDIT POST
// =====================================================

router.put(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const post =
                await Post.findOne({

                    _id:
                        req.params.id,

                    userId:
                        req.user.id

                });


            if (!post) {

                return res.status(404).json({

                    message:
                        "Post Not Found or Access Denied"

                });

            }


            const {
                title,
                category,
                location,
                description
            } = req.body;


            if (
                title !== undefined
            ) {

                post.title =
                    title;

            }


            if (
                category !== undefined
            ) {

                post.category =
                    category;

            }


            if (
                location !== undefined
            ) {

                post.location =
                    location;

            }


            if (
                description !== undefined
            ) {

                post.description =
                    description;

            }


            await post.save();


            res.json({

                message:
                    "Post Updated Successfully",

                post

            });


        } catch (error) {

            console.error(
                "Edit Post Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);


// =====================================================
// DELETE POST
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const post =
                await Post.findOneAndDelete({

                    _id:
                        req.params.id,

                    userId:
                        req.user.id

                });


            if (!post) {

                return res.status(404).json({

                    message:
                        "Post Not Found or Access Denied"

                });

            }


            res.json({

                message:
                    "Post Deleted Successfully"

            });


        } catch (error) {

            console.error(
                "Delete Post Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);


// =====================================================
// RECOVER ITEM
// =====================================================

router.patch(
    "/:id/recover",
    authMiddleware,
    async (req, res) => {

        try {

            const post =
                await Post.findOneAndUpdate(

                    {
                        _id:
                            req.params.id,

                        userId:
                            req.user.id
                    },

                    {
                        recovered:
                            true
                    },

                    {
                        new:
                            true
                    }

                );


            if (!post) {

                return res.status(404).json({

                    message:
                        "Post Not Found or Access Denied"

                });

            }


            res.json({

                message:
                    "Item Marked As Recovered",

                post

            });


        } catch (error) {

            console.error(
                "Recover Item Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);

// =====================================================
// ADMIN DELETE ANY POST
// =====================================================

router.delete(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const post =
                await Post.findByIdAndDelete(
                    req.params.id
                );

            if (!post) {

                return res.status(404).json({

                    message:
                        "Post Not Found"

                });

            }

            res.json({

                message:
                    "Post Deleted By Admin"

            });

        } catch (error) {

            console.error(
                "Admin Delete Post Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);


module.exports = router;
