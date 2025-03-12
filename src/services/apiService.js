const axios = require("axios");
const { OODS_API_KEY, OODS_BASE_URL } = require("../config/config");

const fetchLiveOdds = async () => {
  try {
    if (!OODS_API_KEY) {
      throw new Error("API key is missing. Check your .env file.");
    }

    const response = await axios.get(
      `${OODS_BASE_URL}?apiKey=${OODS_API_KEY}&regions=us,uk,au,eu`
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(
      "Error fetching live odds:",
      error.response?.data || error.message
    );
    return [];
  }
};

module.exports = {
  fetchLiveOdds,
};
