const { pool } = require('../../database/index.js');

module.exports = {
  updateHelpfulness: function (review_id, callback) {
    const queryString = `SELECT helpfulness FROM reviews WHERE id = ${review_id}`;

    pool.query(queryString, (err, recommendCount) => {
      recommendCount = recommendCount.rows[0].helpfulness;
      if (err) {
        callback(err.stack);
      } else {
        recommendCount += 1;
      }

      const queryString = `UPDATE reviews SET helpfulness = ${recommendCount} WHERE id = ${review_id}`;

      pool.query(queryString, (err, recommendCount) => {
        if (err) {
          callback(err.stack);
        } else {
          callback(null, recommendCount);
        }
      });
    });
  }
};