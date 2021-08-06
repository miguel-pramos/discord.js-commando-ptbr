const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: "Checa o ping do bot com o servidor.",
			throttling: {
				usages: 5,
				duration: 10,
			},
		});
	}

	async run(msg) {
		const ping = Date.now() - msg.createdTimestamp;

		msg.reply(
			`:ping_pong: Pong! - Latência do Bot: ${ping}, Latência da API: ${this.client.ws.ping}`
		);
	}
};
