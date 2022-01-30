var mongoose = require('mongoose');
var Schema = mongoose.Schema;

configurationSchema = new Schema( {
	username: String,
	password: String
}),
configuration = mongoose.model('configuration', configurationSchema);

module.exports = configuration;