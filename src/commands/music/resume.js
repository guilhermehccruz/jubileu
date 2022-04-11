export const name = 'resume';
export const description = 'Voltar a tocar';
export const usage = '';
export const aliases = ['r'];
export const guildOnly = true;
export const args = false;

export function execute(servers, message) {
	if (typeof message.guild.voice === 'undefined' ||
		message.guild.voice === null ||
		typeof servers[message.guild.id].dispatcher === 'undefined' ||
		servers[message.guild.id].dispatcher === null ||
		servers[message.guild.id].paused == false) {
		return;
	}

	servers[message.guild.id].dispatcher.resume();
	servers[message.guild.id].paused = false;

	message.channel.send('Voltou!');
}
