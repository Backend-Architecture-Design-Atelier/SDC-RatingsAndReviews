const models = require('../models/reviewsMeta.js');

module.exports = {
  get: function (req, res) {
    const product_id = (req.query.product_id);
    models.getMetadata(product_id, (err, reviewsMetadata) => {
      if (err) {
        res.status(404).send();
      } else {
        res.status(200).send(reviewsMetadata);
      }
    });
  }
};
