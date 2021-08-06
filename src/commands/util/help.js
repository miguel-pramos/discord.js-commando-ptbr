const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Lista os comandos disponíveis.',
			examples: ['help', 'help ban'],
			guarded: true,
			args: [
				{
					key: 'command',
					prompt: 'Qual comando deseja saber mais?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'todos';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						\n__Comando **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Somente em servidores)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Formato:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Apelidos:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Grupo:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Detalhes:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Exemplos:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.reply('\n' + help));
				} catch(err) {
					messages.push(await msg.reply('Incapaz de enviar informações pela DM. Provavelmente estão desativadas.'));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Múltiplos comandos encontrados, seja mais específico.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Comando desconhecido. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} para ver a lista de comandos.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.reply(stripIndents`
					${oneLine`\n
						Para usar um comando em ${msg.guild ? msg.guild.name : 'qualquer servidor'},
						use ${Command.usage('comando', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						Por exemplo, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					Para usar um comando na DM use ${Command.usage('comando', null, null)} sem prefixo.

					Use ${this.usage('<comando>', null, null)} para ver informações detalhadas de um comando.
					Use ${this.usage('todos', null, null)} para ver uma lista de *todos* os comandos.

					__**${showAll ? 'Todos comandos' : `Comandos disponíveis em ${msg.guild || 'essa DM'}`}**__

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.reply('Informações enviadas para DM.'));
			} catch(err) {
				messages.push(await msg.reply('Incapaz de enviar informações pela DM. Provavelmente estão desativadas.'));
			}
			return messages;
		}
	}
};
