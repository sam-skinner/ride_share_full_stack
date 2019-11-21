const { Model } = require('objection');
const Passengers = require("./Passengers");
const Drivers = require("./Drivers");
const Vehicle = require("./Vehicle");
const Location = require("./Location");

class Ride extends Model {
    static get tableName() {
        return 'ride';
    }
    static get relationMappings() {
        return {
            passengers: {
                relation: Model.HasManyRelation,
                modelClass: Passengers,
                join: {
                    from: 'ride.id',
                    to: 'passengers.ride_id'
                }
            },
            drivers: {
                relation: Model.HasManyRelation,
                modelClass: Drivers,
                join: {
                    from: 'ride.id',
                    to: 'drivers.ride_id'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'ride.vehicle_id',
                    to: 'vehicle.id'
                }
            },
            fromLocation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.from_location_id',
                    to: 'location.id'
                }
            },
            toLocation: {
                relation: Model.BelongsToOneRelation,
                modelClass: Location,
                join: {
                    from: 'ride.to_location_id',
                    to: 'location.id'
                }
            }
        }
    }
}

module.exports = Ride;