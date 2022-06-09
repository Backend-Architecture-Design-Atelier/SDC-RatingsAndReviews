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
  reported BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER NOT NULL
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

COPY reviews FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/reviews.csv' DELIMITER ',' CSV Header;
COPY photos FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/reviews_photos.csv' DELIMITER ',' CSV Header;
COPY characteristics FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/characteristics.csv' DELIMITER ',' CSV Header;
COPY characteristic_reviews FROM '/Users/neil/hr-immersive/sdc/SDC-RatingsAndReviews/example_data/characteristic_reviews.csv' DELIMITER ',' CSV Header;