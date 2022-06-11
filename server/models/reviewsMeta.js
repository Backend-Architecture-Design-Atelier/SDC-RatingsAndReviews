const { pool } = require('../../database/index.js');

module.exports = {
  getMetadata: function (product_id, callback) {

    // const queryString = `
    // json_build_object (
    //   '1', photos.id,
    //   '2', photos.url,
    //   '3',
    //   '4',
    //   '5'
    // ) AS ratings
    // `;

    pool.query(queryString, (err, results) => {
      if (err) {
        console.log(err.stack)
        callback(err.stack);
      } else {
        results = results.rows;
        // const reviews = {
        //   product_id,
        //   page,
        //   count,
        //   results
        // }
        callback(null, results);
      }
    });
  }
};
