const { pool } = require('../../database/index');

module.exports = {
  updateHelpfulness(reviewId, callback) {
    const queryString = `SELECT helpfulness FROM reviews WHERE id = ${reviewId}`;

    pool.query(queryString, (err, recommendCount) => {
      let currCount = recommendCount.rows[0].helpfulness;
      if (err) {
        callback(err.stack);
      } else {
        currCount += 1;
      }

      const updateQueryString = `UPDATE reviews SET helpfulness = ${currCount} WHERE id = ${reviewId}`;

      pool.query(updateQueryString, (updateErr, newCount) => {
        if (updateErr) {
          callback(updateErr.stack);
        } else {
          callback(null, newCount);
        }
      });
    });
  },
};
