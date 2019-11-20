const { Model } = require('objection');

class VehicleType extends Model {
    static get tableName() {
        return 'vehicle_type';
    }
    static get relationMappings() {
        return {
            vehicle: {
                relation: Model.HasManyRelation,
                modelClass: Vehicle,
                join: {
                    from: 'vehicle_type.id',
                    to: 'vehicle.vehicle_type_id'
                }
            }
        }
    }
}

module.exports = VehicleType;