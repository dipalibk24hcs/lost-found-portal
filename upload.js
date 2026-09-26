const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(__dirname, "../uploads")
        );

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1E9
            ) +
            path.extname(
                file.originalname
            );

        cb(
            null,
            uniqueName
        );

    }

});

const fileFilter = (req, file, cb) => {

    const allowedTypes =
        /jpg|jpeg|png|gif/;

    const extname =
        allowedTypes.test(
            path.extname(
                file.originalname
            ).toLowerCase()
        );

    const mimetype =
        allowedTypes.test(
            file.mimetype
        );

    if (
        extname &&
        mimetype
    ) {

        return cb(
            null,
            true
        );

    }

    cb(
        new Error(
            "Only Images Allowed"
        )
    );

};

const upload =
    multer({
        storage: storage,
        fileFilter: fileFilter
    });

module.exports = upload;