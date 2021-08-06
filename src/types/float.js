const ArgumentType = require('./base');

class FloatArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'float');
	}

	validate(val, msg, arg) {
		const float = Number.parseFloat(val);
		if(Number.isNaN(float)) return false;
		if(arg.oneOf && !arg.oneOf.includes(float)) {
			return `Escolha uma das seguintes opções: ${arg.oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.min !== null && typeof arg.min !== 'undefined' && float < arg.min) {
			return `Digite um número maior ou igual a ${arg.min}.`;
		}
		if(arg.max !== null && typeof arg.max !== 'undefined' && float > arg.max) {
			return `Digite um número menor ou igual a ${arg.max}.`;
		}
		return true;
	}

	parse(val) {
		return Number.parseFloat(val);
	}
}

module.exports = FloatArgumentType;
