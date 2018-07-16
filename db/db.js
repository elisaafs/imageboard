const spicedPg = require("spiced-pg");
let db;

db = spicedPg(`postgres:Elisa:elisa1@localhost:5432/imageboard`);

exports.getImages = function() {
    const query = `SELECT * FROM images`;

    return db.query(query).then(results => {
        return results.rows;
    });
};
