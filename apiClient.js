const request = require('request-promise-native');

const API_URL = process.env.API_ENDPOINT+ '/animals';

const options = {
    uri: API_URL,
    json: true
};

function toFeedingInstructions(animal, timeOfDay) {
    return {
      name: animal.name,
      image: process.env.API_ENDPOINT + animal.image.path,
      food: animal.foodSchedule[timeOfDay]
    };
}

function getFeedingInstructions(timeOfDay) {
    console.log('url', API_URL);
    return request(options)
            .then((animals) => animals.map((animal) => toFeedingInstructions(animal, timeOfDay)))
            .catch(`Failed to fetch stuff from ${API_URL}`)
}

module.exports = {
  getFeedingInstructions: getFeedingInstructions
};
