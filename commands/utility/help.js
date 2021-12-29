const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lista os comandos e os descreve',
	usage: '',
	aliases: ['h'],
	guildOnly: false,
	args: false,
	async execute(servers, message) {
		const embed = new MessageEmbed()
			.setTitle('Ajuda nos comandos do bot')
			.setDescription([
				'clear: Limpa a fila de músicas',
				'help: Lista os comandos e os descreve',
				'join: Entra no canal de voz que o usuário está conectado',
				'leave: Sai do canal de voz',
				'p: Toca o audio do vídeo do youtube enviado, ou busca uma música no youtube baseado no que foi digitado',
				'pause: Pausa a música tocando',
				'resume: Volta a tocar a música de onde ela parou',
			]);

		message.channel.send(embed);
	},
};
