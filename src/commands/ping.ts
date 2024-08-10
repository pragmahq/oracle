import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong!");

export async function execute(interaction: CommandInteraction) {
  await interaction.reply(`Pong! <@${interaction.user.id}>`);
  console.log(interaction.user.avatarURL());
}
