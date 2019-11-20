// Knex
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'faraday.cse.taylor.edu',
        user: 'samuel_skinner',
        password: 'favacida',
        database: 'samuel_skinner'
    }
});

// Objection
const objection = require('objection');
const Model = objection.Model;
Model.knex(knex);

// Models
const Authorization = require("./models/Authorization");
const Driver = require("./models/Driver");
const Drivers = require("./models/Drivers");
const Location = require("./models/Location");
const Passenger = require("./models/Passenger");
const Passengers = require("./models/Passengers");
const Ride = require("./models/Ride");
const State = require("./models/State");
const Vehicle = require("./models/Vehicle");
const VehicleType = require("./models/VehicleType");

// Hapi
const Joi = require("@hapi/joi");
const Hapi = require("@hapi/hapi")

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
      cors: true
    }
  });

async function init() {    
    await server.start();
}

init();