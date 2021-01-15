const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
  */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => { //requests users ip address
    if (error) return callback(error, null); //if error, error
    if (response.statusCode !== 200) { //if the response is anything but 200 (aka response ok)
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
  
    const ip = JSON.parse(body).ip; // json.parse only the ip (i have no clue why ip is at the end i had to use the tip for that one idk why its there)
    callback(null, ip);
  });
  // use request to fetch IP address from JSON API
};

const fetchCoordsByIp = function(ip, callback) {
  const url = `https://freegeoip.app/json/${ip}`;
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching coords: ${body}`), null);
      return;
    }

    const {latitude, longitude} = JSON.parse(body);
    callback(null, {latitude, longitude});
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  request(url, (error, response, body) => {

    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};


const nextISSTimesForMyLocation = function(callback) { //handles the functions async, callbacks and all. 
  fetchMyIP((error, ip) => { //first async func called
    if (error) {
      return callback(error, null); //if error, error
    }
  
    fetchCoordsByIp(ip, (error, coords) => { //if no error move onto this one
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, passes) => {// etc etc
        if (error) {
          return callback(error, null);
        }

        callback(null, passes); //no error, just what we want via callback
      });
    });
  });
};
module.exports = {
  nextISSTimesForMyLocation
};