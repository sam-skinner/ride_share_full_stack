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
  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
      options: {
        prettyPrint: true
      }
    });

  // Configure routes
  server.route([
    {
      //DRIVER
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
      method: "POST",
      path: "/drivers",
      config: {
        description: "Add a new driver",
        validate: {
          payload: Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            phone: Joi.string().required(),
            license_number: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingDriver = await Driver.query()
            .where("license_number", request.payload.license_number)
            .first();

          if (existingDriver) {
            return {
              ok: false,
              msge: `Driver with license number '${request.payload.license_number}' already registered.`
            };
          }

          const newDriver = await Driver.query().insert({
            first_name: request.payload.first_name,
            last_name: request.payload.last_name,
            phone: request.payload.phone,
            license_number: request.payload.license_number
          });

          if (newDriver) {
            return {
              ok: true,
              msge: 'Driver registered'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not register driver'
            };
          }
        }
      }
    },
    {
      method: "PUT",
      path: "/drivers/{id}",
      config: {
        description: "Update a driver",
        validate: {
          payload: Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            phone: Joi.string().required(),
            license_number: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingDriver = await Driver.query()
            .where("id", request.params.id)
            .first();

          if (!existingDriver) {
            return {
              ok: false,
              msge: `Driver with id '${request.params.id}' not found.`
            };
          }

          const newDriver = await Driver.query().update({
            first_name: request.payload.first_name,
            last_name: request.payload.last_name,
            phone: request.payload.phone,
            license_number: request.payload.license_number
          });

          if (newDriver) {
            return {
              ok: true,
              msge: 'Driver updated'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not update driver'
            };
          }
        }
      }
    },
    {
      method: "DELETE",
      path: "/drivers/{id}",
      config: {
        description: "Delete a driver"
      },
      handler: (request, h) => {
        return Driver.query()
          .deleteById(request.params.id)
          .then(rowsDeleted => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted account with id '${request.params.id}'`
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't delete account with id '${request.params.id}'`
              };
            }
          });
      }
    },
    //RIDE
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
      method: "POST",
      path: "/rides",
      config: {
        description: "Add a new Ride",
        validate: {
          payload: Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
            distance: Joi.number(),
            fuel_price: Joi.number(),
            fee: Joi.number(),
            vehicle_id: Joi.number().integer(),
            from_location_id: Joi.number().integer().required(),
            to_location_id: Joi.number().integer().required()
          })
        },
        handler: async (request, h) => {
          const newRide = await Ride.query().insert({
            date: request.payload.date,
            time: request.payload.time,
            distance: request.payload.distance,
            fuel_price: request.payload.fuel_price,
            fee: request.payload.fee,
            vehicle_id: request.payload.vehicle_id,
            from_location_id: request.payload.from_location_id,
            to_location_id: request.payload.to_location_id
          });

          if (newRide) {
            return {
              ok: true,
              msge: 'Created ride'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not create ride'
            };
          }
        }
      }
    },
    {
      method: "PUT",
      path: "/ride/{id}",
      config: {
        description: "Update a ride",
        validate: {
          payload: Joi.object({
            date: Joi.string().required(),
            time: Joi.string().required(),
            distance: Joi.number(),
            fuel_price: Joi.number(),
            fee: Joi.number(),
            vehicle_id: Joi.number().integer(),
            from_location_id: Joi.number().integer().required(),
            to_location_id: Joi.number().integer().required()
          })
        },
        handler: async (request, h) => {
          const existingRide = await Ride.query()
            .where("id", request.params.id)
            .first();

          if (!existingRide) {
            return {
              ok: false,
              msge: `Ride with id '${request.params.id}' not found.`
            };
          }

          const newRide = await Ride.query().update({
            date: request.payload.date,
            time: request.payload.time,
            distance: request.payload.distance,
            fuel_price: request.payload.fuel_price,
            fee: request.payload.fee,
            vehicle_id: request.payload.vehicle_id,
            from_location_id: request.payload.from_location_id,
            to_location_id: request.payload.to_location_id
          });

          if (newRide) {
            return {
              ok: true,
              msge: 'Ride updated'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not update ride'
            };
          }
        }
      }
    },
    {
      method: "DELETE",
      path: "/rides/{id}",
      config: {
        description: "Delete a ride"
      },
      handler: (request, h) => {
        return Ride.query()
          .deleteById(request.params.id)
          .then(rowsDeleted => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted ride with id '${request.params.id}'`
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't ride account with id '${request.params.id}'`
              };
            }
          });
      }
    },
    //LOCATION
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
      method: "POST",
      path: "/locations",
      config: {
        description: "Add a new location",
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip_code: Joi.number().integer().required()
          })
        },
        handler: async (request, h) => {
          const existingLocation = await Location.query()
            .where("name", request.payload.name)
            .andWhere("address", request.payload.address)
            .first();

          if (existingLocation) {
            return {
              ok: false,
              msge: `Location '${request.payload.name}' at '${request.payload.address}' already exists.`
            };
          }

          const newLocation = await Location.query().insert({
            name: request.payload.name,
            address: request.payload.address,
            city: request.payload.city,
            state: request.payload.state,
            zip_code: request.payload.zip_code
          });

          if (newLocation) {
            return {
              ok: true,
              msge: 'Location created'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not create location'
            };
          }
        }
      }
    },
    {
      method: "PUT",
      path: "/location/{id}",
      config: {
        description: "Update a location",
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.number().integer().required(),
            zip_code: Joi.number().integer().required()
          })
        },
        handler: async (request, h) => {
          const existingLocation = await Location.query()
            .where("id", request.params.id)
            .first();

          if (!existingLocation) {
            return {
              ok: false,
              msge: `Location with id '${request.params.id}' not found.`
            };
          }

          const newLocation = await Location.query().update({
            name: request.payload.name,
            address: request.payload.address,
            city: request.payload.city,
            state: request.payload.state,
            zip_code: request.payload.zip_code
          });

          if (newLocation) {
            return {
              ok: true,
              msge: 'Location updated'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not update location'
            };
          }
        }
      }
    },
    {
      method: "DELETE",
      path: "/locations/{id}",
      config: {
        description: "Delete a location"
      },
      handler: (request, h) => {
        return Location.query()
          .deleteById(request.params.id)
          .then(rowsDeleted => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted location with id '${request.params.id}'`
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't location account with id '${request.params.id}'`
              };
            }
          });
      }
    },
    //PASSENGER
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
      method: "POST",
      path: "/passengers",
      config: {
        description: "Add a new passenger",
        validate: {
          payload: Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            phone: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingPassenger = await Passenger.query()
            .where("phone", request.payload.phone)
            .first();

          if (existingPassenger) {
            return {
              ok: false,
              msge: `Passenger with phone number '${request.payload.phone}' already exists.`
            };
          }

          const newPassenger = await Passenger.query().insert({
            first_name: request.payload.first_name,
            last_name: request.payload.last_name,
            phone: request.payload.phone
          });

          if (newPassenger) {
            return {
              ok: true,
              msge: 'Passenger registered'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not register passenger'
            };
          }
        }
      }
    },
    {
      method: "PUT",
      path: "/passenger/{id}",
      config: {
        description: "Update a passenger",
        validate: {
          payload: Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            phone: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingPassenger = await Passenger.query()
            .where("id", request.params.id)
            .first();

          if (!existingPassenger) {
            return {
              ok: false,
              msge: `Passenger with id '${request.params.id}' not found.`
            };
          }

          const newLocation = await Location.query().update({
            first_name: request.payload.first_name,
            last_name: request.payload.last_name,
            phone: request.payload.phone
          });

          if (newPassenger) {
            return {
              ok: true,
              msge: 'Passenger updated'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not update passenger'
            };
          }
        }
      }
    },
    {
      method: "DELETE",
      path: "/passengers/{id}",
      config: {
        description: "Delete a passenger"
      },
      handler: (request, h) => {
        return Passenger.query()
          .deleteById(request.params.id)
          .then(rowsDeleted => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted account with id '${request.params.id}'`
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't delete account with id '${request.params.id}'`
              };
            }
          });
      }
    },
    //STATE
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
    //VEHICLE_TYPE
    {
      method: "GET",
      path: "/vehicle-types",
      config: {
        description: "Retrieve all vehicle types",
      },
      handler: (request, h) => {
        return VehicleType.query();
      }
    },
    {
      method: "POST",
      path: "/vehicle-types",
      config: {
        description: "Add a new vehicle type",
        validate: {
          payload: Joi.object({
            type: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingVehicleType = await VehicleType.query()
            .where("type", request.payload.type)
            .first();

          if (existingVehicleType) {
            return {
              ok: false,
              msge: `Vehicle Type '${request.payload.type}' already exists.`
            };
          }

          const newVehicleType = await VehicleType.query().insert({
            type: request.payload.type
          });

          if (newVehicleType) {
            return {
              ok: true,
              msge: 'Added vehicle type'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not add vehicle type'
            };
          }
        }
      }
    },
    {
      method: "PUT",
      path: "/vehicle-types/{id}",
      config: {
        description: "Update a vehicle type",
        validate: {
          payload: Joi.object({
            type: Joi.string().required()
          })
        },
        handler: async (request, h) => {
          const existingVehicleType = await VehicleType.query()
            .where("id", request.params.id)
            .first();

          if (!existingVehicleType) {
            return {
              ok: false,
              msge: `Vehicle Type with id '${request.params.id}' not found.`
            };
          }

          const newVehicleType = await VehicleType.query().update({
            type: request.payload.type
          });

          if (newVehicleType) {
            return {
              ok: true,
              msge: 'Vehicle Type updated'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not update vehicle type'
            };
          }
        }
      }
    },
    {
      method: "DELETE",
      path: "/vehicle-types/{id}",
      config: {
        description: "Delete a vehicle type"
      },
      handler: (request, h) => {
        return VehicleType.query()
          .deleteById(request.params.id)
          .then(rowsDeleted => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted type with id '${request.params.id}'`
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't type account with id '${request.params.id}'`
              };
            }
          });
      }
    },
    //VEHICLE
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
              msge: `Vehicle with license plate '${request.payload.license_number}' from '${request.payload.license_state}' already registered.`
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
    },
    {
      method: "PUT",
      path: "/vehicles/{id}",
      config: {
        description: "Update a vehicle",
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
            .where("id", request.params.id)
            .first();

          if (!existingVehicle) {
            return {
              ok: false,
              msge: `Vehicle with id '${request.params.id}' not found.`
            };
          }

          const newVehicle = await Vehicle.query().update({
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
              msge: 'Vehicle updated'
            };
          } else {
            return {
              ok: false,
              msge: 'Could not update vehicle'
            };
          }
        }
      }
    },
    {
      method: "DELETE",
      path: "/vehicle/{id}",
      config: {
        description: "Delete a vehicle"
      },
      handler: (request, h) => {
        return Vehicle.query()
          .deleteById(request.params.id)
          .then(rowsDeleted => {
            if (rowsDeleted === 1) {
              return {
                ok: true,
                msge: `Deleted vehicle with id '${request.params.id}'`
              };
            } else {
              return {
                ok: false,
                msge: `Couldn't delete vehicle with id '${request.params.id}'`
              };
            }
          });
      }
    },
  ]);

  await server.start();
}

init();