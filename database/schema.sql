DROP DATABASE IF EXISTS sdcratingsandreviews;
CREATE DATABASE sdcratingsandreviews;

\c sdcratingsandreviews;

DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating SMALLINT NOT NULL,
  date BIGINT DEFAULT EXTRACT(EPOCH FROM CURRENT_TIMESTAMP),
  summary TEXT DEFAULT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS photos CASCADE;
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews,
  url TEXT DEFAULT NULL
);

DROP TABLE IF EXISTS characteristics CASCADE;
CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS characteristic_reviews CASCADE;
CREATE TABLE characteristic_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER REFERENCES characteristics,
  review_id INTEGER REFERENCES reviews,
  value SMALLINT NOT NULL
);

DROP INDEX IF EXISTS product_id_index;
CREATE INDEX product_id_index on reviews (product_id);

DROP INDEX IF EXISTS review_id_index;
CREATE INDEX review_id_index on reviews (id);

DROP INDEX IF EXISTS photo_id_index;
CREATE INDEX photo_id_index on photos (id);

DROP INDEX IF EXISTS p_review_id_index;
CREATE INDEX p_review_id_index on photos (review_id);

DROP INDEX IF EXISTS photo_id_index;
CREATE INDEX photo_id_index on photos (id);

DROP INDEX IF EXISTS p_review_id_index;
CREATE INDEX p_review_id_index on photos (review_id);

DROP INDEX IF EXISTS characteristics_id_index;
CREATE INDEX characteristics_id_index on characteristics (id);

DROP INDEX IF EXISTS characteristics_product_id_index;
CREATE INDEX CONCURRENTLY characteristics_product_id_index on characteristics (product_id);

DROP INDEX IF EXISTS c_reviews_characteristic_id_index;
CREATE INDEX c_reviews_characteristic_id_index on characteristic_reviews (characteristic_id);

COPY reviews FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/reviews.csv' DELIMITER ',' CSV Header;
COPY photos FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/reviews_photos.csv' DELIMITER ',' CSV Header;
COPY characteristics FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/characteristics.csv' DELIMITER ',' CSV Header;
COPY characteristic_reviews FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/characteristic_reviews.csv' DELIMITER ',' CSV Header;