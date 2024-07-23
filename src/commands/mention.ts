import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("mention")
  .setDescription("Mention a user through the bot")
  .addUserOption((option) =>
    option.setName("user").setDescription("The user to mention")
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("Optional message to send")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: CommandInteraction) {
  try {
    const user = await interaction.options.get("user", true).user;
    const message = await interaction.options.get("message", false)?.value;

    if (!user) {
      await interaction.reply({
        content: "User not found",
        ephemeral: true,
      });
      return;
    }

    await interaction.channel?.send(`<@${user?.id}> ${message ? message : ""}`);

    await interaction.reply({
      content: `Mentioned ${user.username} successfully!`,
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({
      content: `Failed to mention user`,
      ephemeral: true,
    });
  }
}
