const { Model } = require('objection');
const Location = require("./Location");

class State extends Model {
    static get tableName() {
        return 'state';
    }
    static get relationMappings() {
        return {
            location: {
                relation: Model.HasManyRelation,
                modelClass: Location,
                join: {
                    from: 'state.abbreviation',
                    to: 'location.state'
                }
            }
        }
    }
}

module.exports = State;