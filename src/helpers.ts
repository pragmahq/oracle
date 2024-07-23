import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type GuildMember,
} from "discord.js";
import db from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
/**
 *
 * Send an onboarding message to the user's DM
 *
 * @export
 * @param {GuildMember} member The member from the guild
 */
export async function sendOnboardingMessage(member: GuildMember) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: "The Oracle",
      iconURL: "https://pragmahq.com/assets/oracle-logo.png",
    })
    .setTitle("Welcome to the Pragma Community!")
    .setDescription(
      "We are glad that you're here! Please complete the onboarding process to be able to interact with the community."
    )
    .setThumbnail(member.avatarURL())
    .setColor("#00caff");

  const button = new ButtonBuilder()
    .setLabel("Onboarding")
    .setURL("https://pragmahq.com/")
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button);

  await member.send({
    embeds: [embed],
    components: [row],
  });
}

export async function addMemberToDB(member: GuildMember) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.discord_id, member.id));

  if (user.length !== 0) return;

  await db.insert(users).values({
    visibility: true,
    discord_id: member.id,
    username: member.user.username,
    display_name: member.user.displayName,
    runes: 0,
    social_links: JSON.stringify([]),
    account_secret: randomBytes(32).toString("hex"),
    onboarding: false,
  });
}
