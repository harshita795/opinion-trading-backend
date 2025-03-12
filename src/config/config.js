require("dotenv").config();

module.exports = {
  OODS_API_KEY: process.env.ODDS_API_KEY,
  API_SPORTS_API_KEY: process.env.API_SPORTS_API_KEY,
  OODS_BASE_URL: "https://api.the-odds-api.com/v4/sports/upcoming/odds",
  BASE_URL: "https://v3.football.api-sports.io",
};
