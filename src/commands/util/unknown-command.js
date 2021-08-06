const Command = require('../base');

module.exports = class UnknownCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unknown-command',
			group: 'util',
			memberName: 'unknown-command',
			description: 'Mostra ajuda para comandos desconhecidos.',
			examples: ['comando-desconhecido banirtodosparasempre'],
			unknown: true,
			hidden: true
		});
	}

	run(msg) {
		return msg.reply(
			`Comando desconhecido. Use ${msg.anyUsage(
				'help',
				msg.guild ? undefined : null,
				msg.guild ? undefined : null
			)} para ver a lista de comandos.`
		);
	}
};
