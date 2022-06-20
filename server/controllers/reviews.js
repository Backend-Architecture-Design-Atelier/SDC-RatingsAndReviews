const models = require('../models/reviews');

module.exports = {
  get(req, res) {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const { sort } = req.query;
    const productId = req.query.product_id;
    models.getReviews(page, count, sort, productId, (err, reviews) => {
      if (err) {
        res.status(404).send();
      } else {
        res.status(200).send(reviews);
      }
    });
  },

  post(req, res) {
    const newReview = req.body;
    models.addReview(newReview, (err) => {
      if (err) {
        res.status(404).send();
      } else {
        res.status(201).send();
      }
    });
  },
};
