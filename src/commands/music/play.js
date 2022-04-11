import ytdl, { getInfo, validateURL } from 'ytdl-core';
import ytpl, { getPlaylistID } from 'ytpl';
import ytsr, { getFilters } from 'ytsr';
import { MessageEmbed } from 'discord.js';
import { execute as join } from './join';

const ytdlFilters = {
	quality: 'highestaudio',
	filter: 'audioonly',
	highWaterMark: 1 << 25,
	volume: false,
	type: 'opus',
};

export const name = 'play';
export const description = 'Toca uma pra você';
export const usage = '<url/nome da música>';
export const aliases = ['p'];
export const guildOnly = true;
export const args = true;

export async function execute(servers, message, args) {
	if (!await join(servers, message)) {
		return;
	}

	message.channel.send('Processando...');

	const urls = await getUrl(message, args);

	if (typeof urls === 'undefined') {
		return;
	}

	for await (const url of urls) {
		const video = (await getInfo(url)).videoDetails;

		await addToQueue(servers, video.video_url, video.title, message);
	}
}

async function getUrl(message, args) {
	if (validateURL(args[0])) {
		return [args[0]];
	}

	if (args[0].includes('/playlist?')) {
		const result = [];
		try {
			const playlistId = await getPlaylistID(args[0]);

			const videos = (await ytpl(playlistId)).items;

			for (const video of videos) {
				result.push(video.shortUrl);
			}

			return result;
		} catch (error) {
			message.channel.send(
				'A playlist não foi encontrada. Se a playlist não for publica, não podemos acessá-la.',
			);

			return;
		}
	}

	const filtered = (await getFilters(args.join(' ')))
		.get('Type')
		.get('Video');

	const searchResult = (await ytsr(filtered.url, { limit: 1 })).items[0];

	if (!searchResult) {
		message.channel.send('Não foi encontrado nenhum vídeo com essa pesquisa');

		return;
	}

	return [searchResult.url];
}

async function addToQueue(servers, url, title, message) {
	if (servers[message.guild.id].queue.length > 0) {
		embedMessage(
			message.channel,
			`Adicionado a fila - Posição ${servers[message.guild.id].queue.length}`,
			title,
			url,
		);
	}

	servers[message.guild.id].queue.push({
		url: url,
		title: title,
	});

	if (!servers[message.guild.id].playing) {
		await playMusic(servers, message);
	}
}

async function playMusic(servers, message) {
	servers[message.guild.id].dispatcher = await servers[
		message.guild.id
	].connection.play(ytdl(servers[message.guild.id].queue[0].url, ytdlFilters));

	servers[message.guild.id].dispatcher.on('start', () => {
		servers[message.guild.id].playing = true;
		embedMessage(
			message.channel,
			'Agora tocando',
			servers[message.guild.id].queue[0].title,
			servers[message.guild.id].queue[0].url,
		);
	});

	servers[message.guild.id].dispatcher.on('finish', async () => {
		servers[message.guild.id].queue.shift();
		servers[message.guild.id].playing = false;

		if (servers[message.guild.id].queue.length > 0) {
			await playMusic(servers, message);
		} else {
			servers[message.guild.id].dispatcher = null;
		}
	});
}

function embedMessage(channel, title, videoTitle, url) {
	channel.send(
		new MessageEmbed().setTitle(title).setDescription(`[${videoTitle}](${url})`),
	);
}
