const spicedPg = require("spiced-pg");
let db;

db = spicedPg(`postgres:Elisa:elisa1@localhost:5432/imageboard`);

exports.getImages = function() {
    const query = `SELECT * FROM images ORDER BY created_at DESC`;

    return db.query(query).then(results => {
        return results.rows;
    });
};

exports.getImageDetails = function(imageId) {
    const query = `SELECT * FROM images WHERE id = $1`;
    const params = [imageId];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
};

exports.getCommentsByImageId = function(imageId) {
    const query = `SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC`;
    const params = [imageId];
    return db.query(query, params).then(results => {
        return results.rows;
    });
};

exports.addComment = function(imageId, userName, comment) {
    const query = `
          INSERT INTO comments (image_id, username, comment)
          VALUES ($1, $2, $3)
          RETURNING *
    `;
    const params = [imageId, userName, comment];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
};

exports.addImage = function(title, description, username, url) {
    const query = `
          INSERT INTO images (title, description, username, url)
          VALUES ($1, $2, $3, $4)
          RETURNING *
    `;
    const params = [title, description, username, url];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
};
