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

    const queryString = `
    SELECT reviews.id, rating, summary, recommend, response, body, date(to_timestamp(date / 1000)::date), reviewer_name, helpfulness,

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

    WHERE product_id = ${product_id}
    GROUP BY reviews.id
    ORDER BY ${sort} DESC
    LIMIT ${count}
    OFFSET ${(page * count) - count}
    `;

    //Fix date formatting

    pool.query(queryString, (err, results) => {
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
      `;

      pool.query(queryString, queryArgs, (err, reviewId) => {
        if (err) {
          console.log(err.stack);
          callback(err.stack);
        }

        console.log('REVIEW ID', reviewId)

        // if (photos.length > 0) {
        //   photos.forEach((photo) => {
        //     const photosQueryString =`
        //       INSERT INTO photos (review_id, url)
        //       VALUES (${reviewId}, ${photo})
        //     `;

        //     pool.query(photosQueryString, (err) => {
        //       if (err) {
        //         callback(err.stack);
        //       }
        //     });
        //   })
        // }

        // const characteristicsQueryString =`
        //   SELECT id FROM characteristics WHERE product_id = ${product_id}
        // `;

        // pool.query(characteristicsQueryString, (err, characteristicIds) => {
        //   if (err) {
        //     callback(err.stack);
        //   }
        //   console.log('CHARACTERISTIC IDS',characteristicIds)
        //   const characteristicKeys = Object.keys(characteristics);

        //   if (characteristicIds.length > 0) {
        //     characteristicIds.forEach((id, index) => {
        //       const characteristicReviewsQuery =`
        //         INSERT INTO characteristic_reviews (characteristic_id, review_id, value)
        //         VALUES (${id}, ${reviewId}, ${characteristics[characteristicKeys[index]]})
        //       `;

        //       pool.query(characteristicReviewsQuery, (err, newReview) => {
        //         if (err) {
        //           callback(err.stack);
        //         } else {
        //           callback(null, newReview);
        //         }
        //       });
        //     })
        //   }
        // });
      });
    }
  };