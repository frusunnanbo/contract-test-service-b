app = require('express')();

app.get('/', (request, response) => response.send('Hupp!'));

app.listen(3001);
