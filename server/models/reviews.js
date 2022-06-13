const { pool } = require('../../database/index.js');

module.exports = {
  getReviews: function (page, count, sort, product_id, callback) {
    if (sort === 'relevant') {
      sort = 'date, helpfulness';
    }
    if (sort === 'helpful') {
      sort = 'helpfulness';
    }
    if (sort === 'newest') {
      sort = 'date';
    }
    const offset = (page * count) - count;
    const queryArgs = [product_id, sort, count, offset];
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

    pool.query(queryString, queryArgs, (err, results) => {
      if (err) {
        console.log(err.stack)
        callback(err.stack);
      } else {
        results = results.rows;
        const reviews = {
          product: product_id,
          page,
          count,
          results
        }
        callback(null, reviews);
      }
    });
  },
  addReview: function (newReview, callback) {
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = newReview;
    const queryArgs = [product_id, rating, summary, body, recommend, name, email];
    const queryString =`
      INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `;

      pool.query(queryString, queryArgs, (err, reviewId) => {
        if (err) {
          console.log(err.stack);
          callback(err.stack);
        }

        reviewId = reviewId.rows[0].id;

        if (photos.length > 0) {
          photos.forEach((photo) => {
            const photoQueryArgs = [reviewId, photo]
            const photosQueryString =`
              INSERT INTO photos (review_id, url)
              VALUES ($1, $2)
            `;

            pool.query(photosQueryString, photoQueryArgs, (err, results) => {
              if (err) {
                console.log(err.stack);
                callback(err.stack);
              }
            });
          })
        }

        const characteristicsQueryString =`
          SELECT id FROM characteristics WHERE product_id = ${product_id}
        `;

        pool.query(characteristicsQueryString, (err, characteristicIds) => {
          if (err) {
            console.log(err.stack);
            callback(err.stack);
          }

          characteristicIds = characteristicIds.rows
          const characteristicKeys = Object.keys(characteristics);

          if (characteristicIds.length > 0 && characteristicKeys.length > 0) {
            characteristicIds.forEach((characteristic, index) => {
              const characteristic_id = characteristic.id;

              if (characteristicKeys.indexOf(characteristic_id + '') > -1) {
                const characteristicReviewsQueryArgs = [characteristic_id, reviewId, characteristics[characteristic_id]]
                const characteristicReviewsQuery =`
                  INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
                  VALUES ($1, $2, $3)
                `;

                pool.query(characteristicReviewsQuery, characteristicReviewsQueryArgs, (err, newReview) => {
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
    }
  };