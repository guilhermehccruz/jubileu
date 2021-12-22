const ytdl = require('ytdl-core');
const ytdlFilters = {
	quality: 'highestaudio',
	filter: 'audioonly',
	fmt: 'mp3',
	highWaterMark: 1 << 25,
};
const { youtube_v3 } = require('googleapis');
const { google_key } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const join = require('./join');

module.exports = {
	name: 'p',
	description: 'Toca uma pra você',
	async execute(servers, message, args) {
		join.execute(servers, message);

		if (ytdl.validateURL(args[0])) {
			const videoDetails = (await ytdl.getInfo(ytdl.getVideoID(args[0])))
				.videoDetails;

			const title = videoDetails.title;
			const channelTitle = videoDetails.ownerChannelName;

			await addToQueue(servers, args[0], title, message.channel, channelTitle);
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
					fields: 'items(id(videoId),snippet(title,channelTitle))',
					type: 'video',
				},
				async (err, res) => {
					if (err) {
						console.log(err);
					}

					try {
						const url =
							'https://www.youtube.com/watch?v=' + res.data.items[0].id.videoId;

						const title = res.data.items[0].snippet.title;
						const channelTitle = res.data.items[0].snippet.channelTitle;

						await addToQueue(
							servers,
							url,
							title,
							message.channel,
							channelTitle,
						);
					}
					catch (error) {
						if (error.name === 'Error [VOICE_PLAY_INTERFACE_BAD_TYPE]') return;
					}
				},
			);
		}
	},
};

async function addToQueue(servers, url, title, channel, channelTitle) {
	if (servers.server.queue.length > 0) {
		await embedMessage(
			channel,
			`Adicionado a fila - Posição ${
				parseInt(servers.server.queue.length) + 1
			}`,
			[title, channelTitle, url],
		);
	}

	servers.server.queue.push({
		url: url,
		title: title,
		channelTitle: channelTitle,
	});

	await playMusic(servers, channel);
}

async function playMusic(servers, channel) {
	if (servers.server.playing === false) {
		servers.server.playing = true;

		servers.server.dispatcher = await servers.server.connection.play(
			ytdl(servers.server.queue[0].url, ytdlFilters),
		);

		await embedMessage(channel, 'Agora tocando', [
			servers.server.queue[0].title,
			servers.server.queue[0].channelTitle,
			servers.server.queue[0].url,
		]);

		servers.server.dispatcher.on('finish', () => {
			servers.server.queue.shift();
			servers.server.playing = false;
			if (servers.server.queue.length > 0) {
				playMusic(servers, channel);
			}
			else {
				servers.server.dispatcher = null;
			}
		});
	}
}

async function embedMessage(channel, title, descriptionItems) {
	let description = '';
	descriptionItems.forEach((item) => {
		description += item;

		if (item !== descriptionItems[-1]) {
			description += '\n\n';
		}
	});
	const embed = new MessageEmbed().setTitle(title).setDescription(description);

	channel.send(embed);
}
