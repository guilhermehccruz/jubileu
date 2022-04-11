export const name = 'remove';
export const description = 'Tira uma música da fila';
export const usage = '<número da música na fila>';
export const aliases = ['rm'];
export const guildOnly = true;
export const args = true;

export function execute(servers, message, args) {
	if (typeof message.guild.voice === 'undefined' ||
		message.guild.voice === null ||
		typeof servers[message.guild.id].dispatcher === 'undefined' ||
		servers[message.guild.id].dispatcher === null) {
		return;
	}

	if (args.length > 1) {
		return message.channel.send('Só é aceito um parâmetro');
	}

	if (isNaN(args[0])) {
		return message.channel.send('Apenas números são aceitos');
	}

	if (args[0] == 0) {
		return message.channel.send('Use ".skip" pra pular a música atual');
	}

	if (args[0] < 1 || args[0] >= servers[message.guild.id].queue.length) {
		return message.channel.send(
			'Não da pra pular a música se ela não estiver na fila carai',
		);
	}

	servers[message.guild.id].queue.splice(args[0], 1);

	return message.channel.send('Removido!');
}
