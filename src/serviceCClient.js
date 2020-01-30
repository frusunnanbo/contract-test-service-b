const request = require('request-promise-native');

const API_URL = process.env.API_ENDPOINT+ '/';

const options = {
    uri: API_URL,
    json: true
};

function getImagePath(animal) {
    return animal.imagePath || animal.image.path;
}

function toFeedingInstructions(animal, timeOfDay) {
    return {
      name: animal.name,
      image: process.env.API_ENDPOINT + getImagePath(animal),
      food: animal.foodSchedule[timeOfDay]
    };
}

function getFeedingInstructions(timeOfDay) {
    return request(options)
            .then((animals) => animals.map((animal) => toFeedingInstructions(animal, timeOfDay)))
            .catch(`Failed to fetch stuff from ${API_URL}`)
}

module.exports = {
  getFeedingInstructions: getFeedingInstructions
};
