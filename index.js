const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db/db");

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

app.get("/images", (req, res) => {
    db.getImages().then(results => {
        res.json(results);
    });
});

app.listen(8080);
