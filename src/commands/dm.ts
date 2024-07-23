import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dm")
  .setDescription("Send a DM to a user through the bot")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to send the DM to")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message to send to the user")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const user = interaction.options.get("user")?.user;
  const message = interaction.options.get("message")?.value as string;

  if (!user || !message) {
    await interaction.reply({
      content: "Failed to get user or message.",
      ephemeral: true,
    });
    return;
  }

  try {
    await user.send(message);
    await interaction.reply({
      content: `Successfully sent a DM to ${user.tag}!`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Failed to send DM:", error);
    await interaction.reply({
      content: `Failed to send a DM to ${user.tag}. They may have DMs disabled or have blocked the bot.`,
      ephemeral: true,
    });
  }
}
