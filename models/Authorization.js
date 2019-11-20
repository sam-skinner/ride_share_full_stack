const { Model } = require('objection');

class Authorization extends Model {
    static get tableName() {
        return 'authorization';
    }
    static get relationMappings() {
        return {
            driver: {
                relation: Model.BelongsToOneRelation,
                modelClass: Driver,
                join: {
                    from: 'authorization.driver_id',
                    to: 'driver.id'
                }
            },
            vehicle: {
                relation: Model.BelongsToOneRelation,
                modelClass: Vehicle,
                join: {
                    from: 'authorization.vehicle_id',
                    to: 'vehicle.id'
                }
            }
        }
    }
}

module.exports = Authorization;