const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util',
			memberName: 'prefix',
			description: 'Mostra ou atualiza o prefixo do bot.',
			format: '[prefix/"default"/"none"]',
			details: oneLine`
				Se nenhum prefixo for dado, o prefixo atual será mostrado.
				Se o prefixo for "padrao" o prefixo será mudado para o padrão do bot.
				Somente administradores podem mudar o prefixo.
			`,
			examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix padrao'],

			args: [
				{
					key: 'prefix',
					prompt: 'Identifique o novo prefixo do bot.',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		// Just output the prefix
		if(!args.prefix) {
			const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
			return msg.reply(stripIndents`
				${prefix ? `O prefixo atual é \`${prefix}\`.` : 'O bot não tem prefixo.'}
				Para usar comandos, use ${msg.anyUsage('comando')}.
			`);
		}

		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
				return msg.reply('Somente administradores podem mudar o prefixo do bot.');
			}
		} else if(!this.client.isOwner(msg.author)) {
			return msg.reply('Somente o dono do bot pode mudar o prefixo do bot.');
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;
		if(lowercase === 'padrao') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'sem prefixo';
			response = `Prefixo resetado para o padrão (${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
			response = prefix ? `O prefixo do foi atualizado para \`${args.prefix}\`.` : 'Prefixo removido.';
		}

		await msg.reply(`${response} Para usar comandos, use ${msg.anyUsage('comando')}.`);
		return null;
	}
};
