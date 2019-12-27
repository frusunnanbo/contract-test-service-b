app = require('express')();

app.get('/', (request, response) => response.send('Service 1'));

app.listen(3001);
