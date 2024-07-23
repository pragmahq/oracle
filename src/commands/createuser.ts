import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { v4 } from "uuid";
import db from "../db";
import { users } from "../../drizzle/schema";

export const data = new SlashCommandBuilder()
  .setName("createuser")
  .setDescription("Create a user in the database");

export async function execute(interaction: CommandInteraction) {
  console.log();

  try {
    await db.insert(users).values({
      discord_id: interaction.user.id,
      username: interaction.user.username,
      display_name: (
        await interaction.guild?.members.fetch(interaction.user.id)
      )?.displayName,
    });
    return interaction.reply({
      content: "Created user successfully!",
      ephemeral: true,
    });
  } catch (error: any) {
    return interaction.reply({
      content: error.message,
    });
  }
}
