const { Model } = require('objection');

class Location extends Model {
    static get tableName() {
        return 'location';
    }
    static get relationMappings() {
        return {
            state: {
                relation: Model.BelongsToOneRelation,
                modelClass: State,
                join: {
                    from: 'location.state',
                    to: 'state.abbreviation'
                }
            },
            fromLocation: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'location.id',
                    to: 'ride.from_location_id'
                }
            },
            toLocation: {
                relation: Model.HasManyRelation,
                modelClass: Ride,
                join: {
                    from: 'location.id',
                    to: 'ride.to_location_id'
                }
            }
        }
    }
}

module.exports = Location;