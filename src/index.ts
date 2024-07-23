import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import ENV from "./env";
import ARGS from "./args";
import { randomBytes } from "crypto";
import { addMemberToDB, sendOnboardingMessage } from "./helpers";
import db from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

if (ARGS.DEVMODE) {
  console.log("[i] Development mode. Making changes will restart the bot.");
}

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildMembers"],
});

async function updateCommandsForAllGuilds() {
  const guilds = await client.guilds.fetch();
  for (const [guildId, guild] of guilds) {
    await deployCommands({ guildId });
    console.log(`[o] Updated commands for guild: ${guild.name}`);
  }
}

client.once("ready", async () => {
  console.log("[o] Discord bot is ready! 🤖");
  await updateCommandsForAllGuilds();
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.on("guildMemberAdd", async (member: GuildMember) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.discord_id, member.id));

  if (!(user && user[0].onboarding)) {
    sendOnboardingMessage(member);
    addMemberToDB(member);
  }
});

client.login(ENV.BOT_TOKEN);
