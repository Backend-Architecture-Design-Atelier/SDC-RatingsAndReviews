const { pool } = require('../../database/index.js');

module.exports = {
  getMetadata: function (product_id, callback) {
    const queryArgs = [product_id]
    const queryString = `
    SELECT json_build_object (
      'product_id', ${product_id},
      'ratings', json_build_object (
        '1', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 1),
        '2', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 2),
        '3', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 3),
        '4', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 4),
        '5', (SELECT COUNT(rating) FROM reviews WHERE product_id = ${product_id} AND rating = 5)
      ),
      'recommended', json_build_object (
        'false', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product_id} AND recommend = false),
        'true', (SELECT COUNT(*) FROM reviews WHERE product_id = ${product_id} AND recommend = true)
      ),
      'characteristics', (
        SELECT json_object_agg (
          name, (SELECT
            json_build_object (
              'id', characteristics.id,
              'value', (SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_id = characteristics.id)
            )
          )
        )
      FROM characteristics
      WHERE product_id = ${product_id}
      )
    ) metadata
    `;

    pool.query(queryString, (err, results) => {
      if (err) {
        console.log(err.stack)
        callback(err.stack);
      } else {
        const metadata = results.rows[0].metadata;
        callback(null, metadata);
      }
    });
  }
};
