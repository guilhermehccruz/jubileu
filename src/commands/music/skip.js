export const name = 'skip';
export const description = 'Pula para a próxima música';
export const usage = '';
export const aliases = ['next', 'n', 's'];
export const guildOnly = true;
export const args = false;

export async function execute(servers, message) {
	if (typeof message.guild.voice === 'undefined' ||
		message.guild.voice === null ||
		typeof servers[message.guild.id].dispatcher === 'undefined' ||
		servers[message.guild.id].dispatcher === null) {
		return;
	}

	if (servers[message.guild.id].paused) {
		await servers[message.guild.id].dispatcher.resume();
		servers[message.guild.id].paused = false;
	}

	await servers[message.guild.id].dispatcher.end();

	return message.channel.send('Pulando!');
}
