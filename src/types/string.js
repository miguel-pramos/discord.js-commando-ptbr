const ArgumentType = require('./base');

class StringArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'string');
	}

	validate(val, msg, arg) {
		if(arg.oneOf && !arg.oneOf.includes(val.toLowerCase())) {
			return `Escolha uma das seguintes opções: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && val.length < arg.min) {
			return `Mantenha o/a ${arg.label} com no mínimo ${arg.min} caracteres.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && val.length > arg.max) {
			return `Mantenha o/a ${arg.label} com no máximo ${arg.max} caracteres..`;
		}
		return true;
	}

	parse(val) {
		return val;
	}
}

module.exports = StringArgumentType;
