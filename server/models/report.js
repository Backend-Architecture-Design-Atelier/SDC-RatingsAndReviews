const { pool } = require('../../database/index.js');

module.exports = {
  reportReview: function (review_id, callback) {
    const queryString = `UPDATE reviews SET reported = TRUE WHERE id = ${review_id}`;

    pool.query(queryString, (err, reportedReview) => {
      if (err) {
        callback(err.stack);
        console.log('hello world')
      } else {
        callback(null, reportedReview);
      }
    });
  }
};