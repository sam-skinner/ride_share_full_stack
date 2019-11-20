const { Model } = require('objection');

class Passengers extends Model {
    static get tableName() {
        return 'passengers';
    }
    static get relationMappings() {
        return {
            passengers: {
                relation: Model.BelongsToOneRelation,
                modelClass: Passenger,
                join: {
                    from: 'passengers.passenger_id',
                    to: 'passenger.id'
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'passengers.ride_id',
                    to: 'ride.id'
                }
            }
        }
    }
}

module.exports = Passengers;