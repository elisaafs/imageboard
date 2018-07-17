const knox = require("knox");
const fs = require("fs");

let secret;

if (process.env.NODE_ENV == "production") {
    secret = process.env; //
} else {
    secret = require("./secret"); //
}

const client = knox.createClient({
    key: secret.AWS_KEY,
    secret: secret.AWS_SECRET,
    bucket: "spicedling"
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.json({
            error: true
        });
    }
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);
    s3Request.on("response", s3Response => {
        console.log(s3Response.statusCode);
        if (s3Response.statusCode == 200) {
            next();
            fs.unlink(req.file.path, () => {});
        } else {
            res.json({
                error: true
            });
        }
    });
};
