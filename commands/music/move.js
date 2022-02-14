module.exports = {
	name: 'move',
	description: 'Muda a posição de uma música na fila',
	usage: '<posição inicial> <posição final>',
	aliases: ['m'],
	guildOnly: true,
	args: true,
	async execute(servers, message, args) {
		if (!servers[message.guild.id].playing) {
			return;
		}

		if (servers[message.guild.id].queue.length < 3) {
			return message.channel.send('A fila não tem músicas pra trocar posições');
		}

		if (args.length != 2) {
			return message.channel.send(
				'É preciso informar 2 argumentos: Posição inicial e final',
			);
		}

		if (isNaN(args[0]) || isNaN(args[1])) {
			return message.channel.send('Apenas números são aceitos como argumentos');
		}

		if (args[0] == '0' || args[1] == '0') {
			return message.channel.send(
				'Não é possível mudar a posição da música que está tocando. Para fazer isso, use o comando ".skip"',
			);
		}

		if (
			args[0] < 1 ||
			args[1] < 1 ||
			args[0] >= servers[message.guild.id].queue.length ||
			args[1] >= servers[message.guild.id].queue.length
		) {
			return message.channel.send('As posições precisam ser válidas');
		}

		if (args[0] == args[1]) {
			return message.channel.send('As posições precisam ser diferentes');
		}

		servers[message.guild.id].queue.splice(
			Number(args[1]),
			0,
			servers[message.guild.id].queue.splice(Number(args[0]), 1)[0],
		);

		return message.channel.send('Movido!');
	},
};
