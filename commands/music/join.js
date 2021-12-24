module.exports = {
	name: 'join',
	description: 'Entra em um canal de voz',
	aliases: ['j'],
	guildOnly: true,
	async execute(servers, message) {
		if (!message.member.voice.channel) {
			return message.reply('conecta na porra de um canal de voz antes krl!');
		}

		servers.server.connection = await message.member.voice.channel.join();
	},
};
