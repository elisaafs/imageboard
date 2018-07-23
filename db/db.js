const spicedPg = require("spiced-pg");
let db;

db = spicedPg(`postgres:Elisa:elisa1@localhost:5432/imageboard`);

exports.getImages = function(limit, offset) {
    const query = `SELECT *
        FROM images
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2`;
    const params = [limit, offset];
    return db.query(query, params).then(results => {
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

exports.addTag = function(imageId, tag) {
    console.log("addTag", imageId, tag);
    const query = `
          INSERT INTO tags (image_id, tag)
          VALUES ($1, $2)
          RETURNING *
    `;
    const params = [imageId, tag];
    return db.query(query, params).then(results => {
        return results.rows[0];
    });
};

exports.getTagsByImageId = function(imagesId) {
    const query = "SELECT * FROM tags WHERE image_id = $1 ORDER BY tag";
    const params = [imagesId];
    return db.query(query, params).then(results => {
        return results.rows;
    });
};

exports.getImagesByTag = function(tag, limit, offset) {
    const query = `
        SELECT images.id, images.url, images.username, images.title, images.description
        FROM images JOIN tags
        ON images.id = tags.image_id
        WHERE tags.tag = $1
        LIMIT $2 OFFSET $3`;
    const params = [tag, limit, offset];
    return db.query(query, params).then(results => {
        return results.rows;
    });
};
