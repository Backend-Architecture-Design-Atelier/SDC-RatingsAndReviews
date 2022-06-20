const { pool } = require('../../database/index');

module.exports = {
  reportReview(reviewId, callback) {
    const queryString = `UPDATE reviews SET reported = TRUE WHERE id = ${reviewId}`;

    pool.query(queryString, (err, reportedReview) => {
      if (err) {
        callback(err.stack);
        console.log(err.stack);
      } else {
        callback(null, reportedReview);
      }
    });
  },
};
