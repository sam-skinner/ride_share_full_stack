const { Model } = require('objection');

class Driver extends Model {
    static get tableName() {
        return 'driver';
    }
    static get relationMappings() {
        return {
            authorization: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: 'driver.id',
                    to: 'authorization.driver_id'
                }
            },
            drivers: {
                relation: Model.HasManyRelation,
                modelClass: Drivers,
                join: {
                    from: 'driver.id',
                    to: 'drivers.driver_id'
                }
            }
        }
    }
}

module.exports = Driver;