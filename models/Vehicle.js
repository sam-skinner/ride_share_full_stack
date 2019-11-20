const { Model } = require('objection');

class Vehicle extends Model {
    static get tableName() {
        return 'vehicle';
    }
    static get relationMappings() {
        return {
            authorization: {
                relation: Model.HasManyRelation,
                modelClass: Authorization,
                join: {
                    from: 'vehicle.id',
                    to: 'authorization.vehicle_id'
                }
            },
            ride: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'vehicle.id',
                    to: 'ride.vehicle_id'
                }
            },
            vehicleType: {
                relation: Model.BelongsToOneRelation,
                modelClass: VehicleType,
                join: {
                    from: 'vehicle.vehicle_type_id',
                    to: 'vehicle_type.id'
                }
            }
        }
    }
}

module.exports = Vehicle;