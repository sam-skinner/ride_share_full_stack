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
  // Configure routes
  server.route([
    {
      method: "GET",
      path: "/drivers",
      config: {
        description: "Retrieve all drivers",
      },
      handler: (request, h) => {
        return Driver.query();
      }
    },
    {
      method: "GET",
      path: "/vehicles",
      config: {
        description: "Retrieve all vehicles",
      },
      handler: (request, h) => {
        return Vehicle.query();
      }
    },
    {
      method: "POST",
      path: "/vehicles",
      config: {
        description: "Add a new vehicle",
        validate: {
          payload: Joi.object({
            make: Joi.string().required(),
            model: Joi.string().required(),
            color: Joi.string().required(),
            vehicleTypeId: Joi.number().integer().required(),
            capacity: Joi.number().integer().required(),
            mpg: Joi.number().required(),
            licenseState: Joi.string().required(),
            licenseNumber: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingVehicle = await Vehicle.query()
            .where("licenseState", request.payload.licenseState)
            .andWhere("licenseNumber", request.payload.licenseNumber)
            .first();
          if (existingVehicle) {
            return {
              ok: false,
              msge: 'Vehicle with license plate ${request.payload.licenseNumber} from ${request.payload.licenseState} already registered.'
            };
          }
        }
      }
    }
  ]);

  await server.start();
}

init();