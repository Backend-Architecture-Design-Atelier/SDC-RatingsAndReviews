const models = require('../models/helpful');

module.exports = {
  put(req, res) {
    const reviewId = req.params.review_id;
    models.updateHelpfulness(reviewId, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    });
  },
};
