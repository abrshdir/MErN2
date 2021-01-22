const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError("could not find this routes!.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose.connect("mongodb://localhost:27017/myDb").then(() => {
    app.listen(5000);
}).catch(error => {
  console.log(error);
});
