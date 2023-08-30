const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("음악재생")
    .setDescription("/음악재생 <URL>로 음악을 재생해보세요!")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("재생할 음악의 URL을 입력하세요.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const url = interaction.options.getString("url");
      const channel = interaction.member.voice.channel;
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      const player = createAudioPlayer();
      const resource = createAudioResource(ytdl(url, { filter: "audioonly" }));
      player.play(resource);
      connection.subscribe(player);
      await interaction.reply(
        `${interaction.member}님이 요청한 노래를 재생합니다.`
      );
    } catch (e) {
      if (TypeError) {
        await interaction.reply("재생할 수 없는 영상입니다.");
      }
    }
  },
};
