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
      path: "/rides",
      config: {
        description: "Retrieve all rides",
      },
      handler: (request, h) => {
        return Ride.query();
      }
    },
    {
      method: "GET",
      path: "/locations",
      config: {
        description: "Retrieve all locations",
      },
      handler: (request, h) => {
        return Location.query();
      }
    },
    {
      method: "GET",
      path: "/passengers",
      config: {
        description: "Retrieve all passengers",
      },
      handler: (request, h) => {
        return Passenger.query();
      }
    },
    {
      method: "GET",
      path: "/states",
      config: {
        description: "Retrieve all states",
      },
      handler: (request, h) => {
        return State.query();
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
            vehicle_type_id: Joi.number().integer().required(),
            capacity: Joi.number().integer().required(),
            mpg: Joi.number().required(),
            license_state: Joi.string().required(),
            license_number: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingVehicle = await Vehicle.query()
            .where("license_state", request.payload.license_state)
            .andWhere("license_number", request.payload.license_number)
            .first();

          if (existingVehicle) {
            return {
              ok: false,
              msge: 'Vehicle with license plate ${request.payload.licenseNumber} from ${request.payload.licenseState} already registered.'
            };
          }

          const newVehicle = await Vehicle.query().insert({
            make: request.payload.make,
            model: request.payload.model,
            color: request.payload.color,
            vehicle_type_id: request.payload.vehicle_type_id,
            capacity: request.payload.capacity,
            mpg: request.payload.mpg,
            license_state: request.payload.license_state,
            license_number: request.payload.license_number
          });

          if (newVehicle) {
            return {
              ok: true,
              msge: 'Created vehicle'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not create vehicle'
            };
          }
        }
      }
    }
  ]);

  await server.start();
}

init();