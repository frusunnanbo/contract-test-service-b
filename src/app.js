const express = require('express');
const expressHbs = require('express-handlebars');
const log = require('debug')('service-b:app');
const moment = require('moment');

const { getFeedingInstructions } = require('./serviceCClient');

const port = process.env.PORT || 3002;

const app = express();

app.use(express.static('static'));

app.engine('handlebars', expressHbs());
app.set('view engine', 'handlebars');
app.get('/', async (request, response) => {
    response.render('animals',
            {
                layout: false,
                nextFeedingTime: getTimeOfDay(request),
                animals: await getFeedingInstructions(getTimeOfDay(request))
            });
});

app.get('/feedingInstructions', (request, response) => getFeedingInstructions(getTimeOfDay(request))
        .then((stuff) => response
                .json(stuff))
        .catch((err) =>
                response.status(500)
                .send(`failed to get stuff: ${err.stack}`)));

app.listen(port, log(`Listening on ${port}`));

function todayAt(hour) {
    return moment().hour(hour).startOf('hour');
}

function getTimeOfDay(request) {
    if (request.query.timeOfDay) {
        return request.query.timeOfDay;
    } else if (moment().isBefore(todayAt(7))) {
        return 'morning';
    } else if (moment().isBefore(todayAt(12))) {
        return 'lunch';
    } else if (moment().isBefore(todayAt(17))) {
        return 'evening';
    } else {
        return 'morning';
    }
}
