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
	date : { type : Date, default: Date.now }
}),
employee = mongoose.model('empleados', productSchema);

module.exports = employee;