const { Model } = require('objection');

class Drivers extends Model {
    static get tableName() {
        return 'drivers';
    }
    static get relationMappings() {
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join: {
                    from: 'drivers.driver_id',
                    to: 'driver.id'
                }
            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: Ride,
                join: {
                    from: 'drivers.vehicle_id',
                    to: 'ride.id'
                }
            }
        }
    }
}

module.exports = Drivers;