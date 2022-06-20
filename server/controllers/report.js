const models = require('../models/report');

module.exports = {
  put(req, res) {
    const reviewId = req.params.review_id;
    models.reportReview(reviewId, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    });
  },
};
