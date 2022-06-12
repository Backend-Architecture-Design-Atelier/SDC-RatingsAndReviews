const models = require('../models/report.js');

module.exports = {
  put: function (req, res) {
    const review_id = req.params.review_id
    models.reportReview(review_id, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send();
      } else {
        res.status(204).send();
      }
    })
  }
};