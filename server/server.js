const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const app = express();
app.use(bodyParser.json())

app.use(cookieParser());

require('dotenv').config();
const mongoose = require('mongoose');

const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const routes = require('./routes');

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`
mongoose.connect(mongoUri);

// SANITIZE
app.use(xss());
app.use(mongoSanitize());

app.use('/api', routes);

const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
});