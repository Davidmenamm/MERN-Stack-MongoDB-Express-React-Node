var mongoose = require('mongoose');
var Schema = mongoose.Schema;

productSchema = new Schema( {
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
} ),

employee = mongoose.model('empleados', productSchema);

module.exports = employee;