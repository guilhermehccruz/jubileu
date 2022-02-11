const { jubileuGuildId, admRoleId } = require('../../config.json');

module.exports = {
	name: 'restart',
	description: 'Reinicia o bot. Requer permissão de administrador do bot',
	usage: '',
	aliases: [],
	guildOnly: false,
	args: false,
	async execute(servers, message, args, client) {
		if (
			!client.guilds.cache
				.get(jubileuGuildId)
				.roles.cache.get(admRoleId)
				.members.get(message.author.id)
		) {
			return message.reply(
				'Você não possui permissão pra executar esse comando',
			);
		}

		process.exit();
	},
};
