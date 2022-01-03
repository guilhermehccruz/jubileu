const ytdl = require('ytdl-core');
const ytdlFilters = {
	quality: 'highestaudio',
	filter: 'audioonly',
	highWaterMark: 1 << 25,
	volume: false,
	type: 'opus',
};
const { youtube_v3 } = require('googleapis');
const { google_key, errorChannelId } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const join = require('./join');

module.exports = {
	name: 'play',
	description: 'Toca uma pra você',
	usage: '<url/nome da música>',
	aliases: ['p'],
	guildOnly: true,
	args: true,
	async execute(servers, message, args, client) {
		if (!(await join.execute(servers, message))) return;

		if (ytdl.validateURL(args[0])) {
			const videoDetails = (await ytdl.getInfo(ytdl.getVideoID(args[0])))
				.videoDetails;

			const title = videoDetails.title;

			await addToQueue(servers, args[0], title, message);
		}
		else {
			const youtube = new youtube_v3.Youtube({
				version: 3,
				auth: google_key,
			});

			youtube.search.list(
				{
					q: args.join(' '),
					part: 'snippet',
					fields: 'items(id(videoId))',
					type: 'video',
				},
				async (err, res) => {
					if (err) {
						return await client.channels.cache
							.get(errorChannelId)
							.send(err, { split: true });
					}

					try {
						const id = res.data.items[0].id.videoId;

						const url = 'https://www.youtube.com/watch?v=' + id;

						const videoDetails = (
							await ytdl.getInfo(res.data.items[0].id.videoId)
						).videoDetails;

						const title = videoDetails.title;

						await addToQueue(servers, url, title, message);
					}
					catch (error) {
						if (error.name === 'Error [VOICE_PLAY_INTERFACE_BAD_TYPE]') return;
					}
				},
			);
		}
	},
};

async function addToQueue(servers, url, title, message) {
	if (servers[message.guild.id].queue.length > 0) {
		await embedMessage(
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

	await playMusic(servers, message);
}

async function playMusic(servers, message) {
	if (servers[message.guild.id].playing === false) {
		servers[message.guild.id].dispatcher = await servers[
			message.guild.id
		].connection.play(
			ytdl(servers[message.guild.id].queue[0].url, ytdlFilters),
		);

		servers[message.guild.id].dispatcher.on('start', async () => {
			servers[message.guild.id].playing = true;
			await embedMessage(
				message.channel,
				'Agora tocando',
				servers[message.guild.id].queue[0].title,
				servers[message.guild.id].queue[0].url,
			);
		});

		servers[message.guild.id].dispatcher.on('finish', async () => {
			await servers[message.guild.id].queue.shift();
			servers[message.guild.id].playing = false;
			if (servers[message.guild.id].queue.length > 0) {
				await playMusic(servers, message);
			}
			else {
				servers[message.guild.id].dispatcher = null;
			}
		});
	}
}

async function embedMessage(channel, title, videoTitle, url) {
	const embed = new MessageEmbed()
		.setTitle(title)
		.setDescription(`[${videoTitle}](${url})`);

	channel.send(embed);
}
