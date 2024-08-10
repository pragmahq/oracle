import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  User,
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
export async function sendOnboardingMessage(member: GuildMember, interaction: CommandInteraction) {
  let isCancelled = false;
  let bio = ""
  let interests = ""

  // Get bio
  await member.send("# Welcome to Pragma!\nWe are glad that you're here! Let's build your Pragma profile. First, give a short description about you. Send it in the chat, and that will be your bio. (Type \"EXIT\" to stop)")
  const collector = member.dmChannel!.createMessageCollector({ max: 1 });
  collector.on('end', async (collected) => {
    bio = collected.map(x => x.content)[0]
    console.log(bio);
    if (bio === "EXIT") {
      member.send("Onboarding flow cancelled. You can always restart it using the `/onboarding` command in the server.")
      return
    }
    await member.send("Write a few lines about your interests. Remember, this information will be used by interested people to contact you about projects or help. Make it as concise as possible. (Type \"EXIT\" to stop)")
    const interestsCollector = member.dmChannel!.createMessageCollector({ max: 1 })
    interestsCollector.on('end', async (collected) => {
      interests = collected.map(x => x.content)[0]
      console.log(interests);
      if (interests === "EXIT") {
        member.send("Onboarding flow cancelled. You can always restart it using the `/onboarding` command in the server.")
        return
      }
      await db.update(users)
        .set({
          bio: bio,
          interests: interests,
          onboarding: true
        })
        .where(eq(users.id, member.id));
      await member.send("Onboarding flow completed! You're good to explore the world of Pragma!")
    });

  });
}

export async function addMemberToDB(member: GuildMember) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, member.user.id));

  if (user.length !== 0) return;

  await db.insert(users).values({
    visibility: true,
    id: member.id,
    bio: "New Pragma member",
    runes: 0,
    achievements: JSON.stringify([]),
    account_secret: randomBytes(32).toString("hex"),
    onboarding: false,
  });
}

export async function getProfileEmbed(user: User) {
  const currentUser = (
    await db.select().from(users).where(eq(users.id, user.id))
  )[0];

  // console.log(currentUser);

  const embed = new EmbedBuilder()
    .setAuthor({
      name: user.username,
    })
    .setTitle(await user.displayName)
    .setDescription(currentUser.bio)
    .addFields({
      name: "Runes",
      value: `⟁${currentUser.runes}`,
      inline: false,
    })
    .setThumbnail(user.displayAvatarURL())
    .setColor("#00b0f4")
    .setFooter({
      text: "Pragma Community",
      iconURL: "https://pragmahq.com/assets/pragma-logo.png",
    });

  return embed;
}
