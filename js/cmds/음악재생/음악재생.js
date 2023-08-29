const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");

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
    //playing music on youtube in discord voice channel.
    const url = interaction.options.getString("url");
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    //connection.
    await interaction.reply("음악을 재생합니다.");
  },
};
