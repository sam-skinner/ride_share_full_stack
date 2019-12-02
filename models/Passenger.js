const { Model } = require('objection');
const Passengers = require("./Passengers");

class Passenger extends Model {
    static get tableName() {
        return 'passenger';
    }
    static get relationMappings() {
        return {
            passengers: {
                relation: Model.HasManyRelation,
                modelClass: Passengers,
                join: {
                    from: 'passenger.id',
                    to: 'passengers.passenger_id'
                }
            }
        }
    }
}

module.exports = Passenger;