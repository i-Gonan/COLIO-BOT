const { SlashCommandBuilder, ConnectionService } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("음악종료")
    .setDescription("지금 재생중인 음악을 종료합니다."),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.destroy();
    await interaction.reply("재생중인 음악을 종료하고 채널에서 나왔어요.");
  },
};
