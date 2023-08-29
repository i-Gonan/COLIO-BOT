const Token = require("./config.json");
const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
//봇이 사용하고자 하는 기능의 의도를 명시.

//cmd 폴더 속 명령어를 읽어오기.
client.commands = new Collection();

const commands = [];

const folderpath = path.join(__dirname, "cmds"); //명령어를 cmds 폴더에 보관
const commandFolders = fs.readdirSync(folderpath);

for (const folder of commandFolders) {
  const cmdpath = path.join(folderpath, folder);
  const cmdfiles = fs
    .readdirSync(cmdpath)
    .filter((file) => file.endsWith(".js"));

  for (const file of cmdfiles) {
    const filePath = path.join(cmdpath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    } else {
      console.log(`${filePath} 파일에는 [data]나 [execute] 인자가 없습니다.`);
    }
  }
}
//ㄴ-> cmds 폴더의 .js 확장자를 가진 파일들 다 뒤집어 까서 data와 execute가 있는지 없는지 보는 절차

client.once("ready", () => {
  console.log(client.user.tag + "로 로그인합니다.");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName} 명령어를 찾을 수 없습니다.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(
      `${interaction.commandName} 명령어를 실행하는 도중에 오류가 발생했습니다.`
    );
    console.error(error);
  }
});
//ㄴ-> 입력받은 명령어가 commands에 있는 명령어인지 확인하고 있으면 실행 아니면 없다고 돌려줌.

const rest = new REST({ version: "10" }).setToken(Token.token);

(async () => {
  try {
    console.log(`${commands.length}개 명령어를 불러오고 있습니다.`);
    await rest.put(Routes.applicationCommands(Token.clientid), {
      body: commands,
    });

    console.log(`${commands.length}개 명령어를 불러왔습니다.`);
  } catch (error) {
    console.error(error);
  }
})();
//ㄴ-> 시작할 때 commands 배열에 들어있는 명령어들을 불러오는 과정.

client.login(Token.token);
