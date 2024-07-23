import { REST, Routes } from "discord.js";
import { commands } from "./commands";
import ENV from "./env";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(ENV.BOT_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    await rest.put(
      Routes.applicationGuildCommands(ENV.BOT_APPLICATION_ID, guildId),
      {
        body: commandsData,
      }
    );
  } catch (error) {
    console.error(error);
  }
}
