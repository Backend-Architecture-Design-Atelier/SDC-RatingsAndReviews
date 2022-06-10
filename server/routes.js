const controller = require('./controllers');
const router = require('express').Router();

router.get('/', controller.reviews.get);

router.post('/', controller.reviews.post);

router.put('/:review_id/helpful', controller.helpful.put)

router.put('/:review_id/report', controller.report.put)

router.get('/meta', controller.reviewsMeta.get);

module.exports = router;