const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.json());
app.use(express.static("./public"));

app.get("/images", (req, res) => {
    console.log("get working");
    const limit = req.query.limit;
    const offset = req.query.offset;
    db.getImages(limit, offset)
        .then(images => {
            console.log("db working");
            res.json(images);
        })
        .catch(err => console.log(err));
});

app.get("/image/:imageId", (req, res) => {
    Promise.all([
        db.getImageDetails(req.params.imageId),
        db.getTagsByImageId(req.params.imageId)
    ])
        .then(results => {
            res.json({
                imageDetails: results[0],
                tags: results[1]
            });
        })
        .catch(err => console.log(err));
});

app.get("/images/tag/:tag", (req, res) => {
    console.log("get working");
    const limit = req.query.limit;
    const offset = req.query.offset;
    db.getImagesByTag(req.params.tag, limit, offset)
        .then(images => {
            console.log("db working");
            console.log(images);
            res.json(images);
        })
        .catch(err => console.log(err));
});

app.get("/comments/:imageId", (req, res) => {
    db.getCommentsByImageId(req.params.imageId)
        .then(comments => {
            res.json(comments);
        })
        .catch(err => console.log(err));
});

app.post("/comment", (req, res) => {
    console.log(req.body);
    db.addComment(req.body.imageId, req.body.username, req.body.comment)
        .then(result => {
            res.json({
                success: true,
                comment: result
            });
        })
        .catch(err => console.log(err));
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req body is", req.body, "req file is", req.file);
    db.addImage(
        req.body.title,
        req.body.description,
        req.body.username,
        config.s3Url + req.file.filename
    ).then(result => {
        const tags = req.body.tags ? req.body.tags.split(",") : [];
        const tagPromises = tags.map(tag =>
            db.addTag(result.id, tag.trim().toLowerCase())
        );
        Promise.all(tagPromises).then(() => {
            res.json({
                success: true,
                image: result
            });
        });
    });
});

app.listen(8080);
