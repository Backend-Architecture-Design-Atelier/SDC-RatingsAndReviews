const { pool } = require('../../database/index');

module.exports = {
  getReviews(page, count, sort, productId, callback) {
    let sortBy = 'date, helpfulness';
    if (sort === 'relevant') {
      sortBy = 'date, helpfulness';
    }
    if (sort === 'helpful') {
      sortBy = 'helpfulness';
    }
    if (sort === 'newest') {
      sortBy = 'date';
    }
    const offset = (page * count) - count;
    const queryArgs = [productId, sortBy, count, offset];
    const queryString = `
    SELECT reviews.id, rating, summary, recommend, response, body, to_char(to_timestamp(date / 1000), 'yyyy-MM-dd"T"00:00:00.000Z') as date, reviewer_name, helpfulness,

    COALESCE (
      ARRAY_AGG (
        json_build_object (
          'id', photos.id,
          'url', photos.url
        )
      )

    FILTER (WHERE photos.id IS NOT NULL), '{}') AS photos
    FROM reviews
    LEFT JOIN photos ON reviews.id = photos.review_id

    WHERE product_id = $1
    GROUP BY reviews.id
    ORDER BY $2 DESC
    LIMIT $3
    OFFSET $4
    `;

    pool.query(queryString, queryArgs, (err, data) => {
      if (err) {
        console.log(err.stack);
        callback(err.stack);
      } else {
        const results = data.rows;
        const reviews = {
          product: productId,
          page,
          count,
          results,
        };
        callback(null, reviews);
      }
    });
  },
  addReview(newReview, callback) {
    const {
      productId, rating, summary, body, recommend, name, email, photos, characteristics,
    } = newReview;
    const queryArgs = [productId, rating, summary, body, recommend, name, email];
    const queryString = `
      INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `;

    pool.query(queryString, queryArgs, (reviewsQueryErr, results) => {
      if (reviewsQueryErr) {
        console.log(reviewsQueryErr.stack);
        callback(reviewsQueryErr.stack);
      }

      const reviewId = results.rows[0].id;

      if (photos.length > 0) {
        photos.forEach((photo) => {
          const photoQueryArgs = [reviewId, photo];
          const photosQueryString = `
              INSERT INTO photos (review_id, url)
              VALUES ($1, $2)
            `;

          pool.query(photosQueryString, photoQueryArgs, (photoQueryErr) => {
            if (photoQueryErr) {
              console.log(photoQueryErr.stack);
              callback(photoQueryErr.stack);
            }
          });
        });
      }

      const characteristicsQueryString = `
          SELECT id FROM characteristics WHERE product_id = ${productId}
        `;

      pool.query(characteristicsQueryString, (characteristicQueryErr, data) => {
        if (characteristicQueryErr) {
          console.log(characteristicQueryErr.stack);
          callback(characteristicQueryErr.stack);
        }

        const characteristicIds = data.rows;
        const characteristicKeys = Object.keys(characteristics);

        if (characteristicIds.length > 0 && characteristicKeys.length > 0) {
          characteristicIds.forEach((characteristic) => {
            const characteristicId = characteristic.id;

            if (characteristicKeys.indexOf(`${characteristicId}`) > -1) {
              const characteristicArgs = [characteristicId, reviewId,
                characteristics[characteristicId]];
              const characteristicReviewsQuery = `
                  INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
                  VALUES ($1, $2, $3)
                `;

              pool.query(characteristicReviewsQuery, characteristicArgs, (err) => {
                if (err) {
                  console.log(err.stack);
                  callback(err.stack);
                }
              });
            }
          });
        }
      });
      callback(null, reviewId);
    });
  },
};
