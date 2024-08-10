import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import db from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { addMemberToDB, sendOnboardingMessage } from "../helpers";

export const data = new SlashCommandBuilder()
  .setName("onboarding")
  .setDescription(
    "Complete the onboarding flow (usually for pre-Oracle members)"
  );

export async function execute(interaction: CommandInteraction) {
  const member = await interaction.guild!.members.fetch({
    user: interaction.user,
  });
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, interaction.user.id));

  if (user.length > 0 && user[0].onboarding) {
    await interaction.reply({
      content: "Onboarding flow already completed. You're good to go!",
      ephemeral: true,
    });
    return;
  } else {
    await addMemberToDB(member);
    await interaction.reply({
      content: "Onboarding message sent!",
      ephemeral: true,
    });
    await sendOnboardingMessage(member, interaction);
  }
}
