const models = require('../models/reviewsMeta');

module.exports = {
  get(req, res) {
    const productId = (req.query.product_id);
    models.getMetadata(productId, (err, reviewsMetadata) => {
      if (err) {
        res.status(404).send();
      } else {
        res.status(200).send(reviewsMetadata);
      }
    });
  },
};
