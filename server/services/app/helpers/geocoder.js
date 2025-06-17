const axios = require("axios");

const getLocation = async (lat, long) => {
  const apikey = process.env.GOOGLE_API_KEY;
  // lat = -6.224829923189245;
  // long = 106.6378011511977;
  try {
    const result = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${long}`,
          key: apikey,
        },
      }
    );

    return result.data.results[0]?.formatted_address;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getLocation;
