import { admRoleId, jubileuGuildId } from '@root/config.json';

export const name = 'restart';
export const description = 'Reinicia o bot. Requer permissão de administrador do bot';
export const usage = '';
export const aliases = ['reset'];
export const guildOnly = false;
export const args = false;

export async function execute(servers, message, args, client) {
	if (
		!client.guilds.cache
			.get(jubileuGuildId)
			.roles.cache.get(admRoleId)
			.members.get(message.author.id)
	) {
		return message.channel.send(
			'Você não possui permissão pra executar esse comando',
		);
	}

	await message.channel.send('Reiniciando!');
	process.exit();
}
