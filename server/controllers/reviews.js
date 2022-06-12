const models = require('../models/reviews.js');

module.exports = {
  get: function (req, res) {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const sort = req.query.sort;
    const product_id = req.query.product_id;
    models.getReviews(page, count, sort, product_id, (err, reviews) => {
      if (err) {
        res.status(404).send();
      } else {
        res.status(200).send(reviews);
      }
    });
  },

  post: function (req, res) {
    const newReview = req.body;
    models.addReview(newReview, (err) => {
      if (err) {
        res.status(404).send();
      } else {
        res.status(201).send();
      }
    });
  }
};