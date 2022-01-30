var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	username: String,
    password: String,
	name: String,
	apellido: String,
	cedula: Number,
	image: String,
	correo: String,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date: { type : Date, default: Date.now }, // fecha de creación
	fechaNac : { type : Date, default: Date.now },
	dir: String,
	cel: Number,
	vaccine_status: String,
	vaccine_type: String,
	vaccine_date: { type : Date, default: Date.now },
	vaccine_dosis: Number,
	typeAccount: String,
} ),

user = mongoose.model('user', userSchema);

module.exports = user;