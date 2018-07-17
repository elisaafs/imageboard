const spicedPg = require("spiced-pg");
let db;

db = spicedPg(`postgres:Elisa:elisa1@localhost:5432/imageboard`);

exports.getImages = function() {
    const query = `SELECT * FROM images ORDER BY created_at DESC`;

    return db.query(query).then(results => {
        return results.rows;
    });
};

exports.addImage = function(title, description, username, url) {
    const q = `
          INSERT INTO images (title, description, username, url)
          VALUES ($1, $2, $3, $4)
          RETURNING *
    `;
    const params = [title, description, username, url];
    return db.query(q, params).then(results => {
        return results.rows[0];
    });
};
