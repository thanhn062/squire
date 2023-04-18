const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const log = require('../resources/log/log.js');

// when user click unclaim
// build the original embeds with original button
// update the ticket by msgID
// delete message from guardian DM
const handleUnclaimButton = async (interaction, client) => {
    // extract message Id from the customId
    const messageID = interaction.customId.split("-")[2]

    // build embeds from ticket details on help-board
    const isoString = interaction.message.embeds[0].data.timestamp;
    const date = new Date(isoString);
    let embedProps = {
        title: interaction.message.embeds[0].data.title,
        timestamp: date,
        footer: interaction.message.embeds[0].data.footer.text,
        userID: interaction.message.embeds[0].data.fields[0].value,
        description: interaction.message.embeds[0].data.description,
        attachment: interaction.message.embeds[0].data.thumbnail.url,
    }
    let ticket = ticketEmbedBuilder(embedProps)

    // update ticket on help board
    const channel = await interaction.client.channels.cache.get(process.env.helpBoardChannelId);
    channel.messages.fetch(messageID)
        .then(message => message.edit({
            embeds: [ticket.embed],
            components: [ticket.buttons]
        }))
        .catch(console.error)
    
    // delete ticket inside of guardian DM
    const dm = await interaction.client.channels.cache.get(interaction.channelId);
    const message = await dm.messages.cache.get(interaction.message.id);
    message.delete().catch(console.error);

    // log
    // get discord name of student and guardian for logging
    const student_discord_id = interaction.message.embeds[0].data.fields[0].value.replaceAll("<@","").replaceAll(">","")
    const guardian_discord_id = interaction.user.id
    const guild = client.guilds.cache.get(process.env.guildId); // Get the guild object
    
    // student
    const student_member = guild.members.cache.get(student_discord_id);
    const student_user = client.users.cache.get(student_discord_id);
    const student_username = student_user.username + "#" + student_user.discriminator
    const student_nickname = student_member.nickname
    const student_name = (student_nickname == null) ? student_username : student_nickname

    // guardian
    const guardian_member = guild.members.cache.get(guardian_discord_id);
    const guardian_user = client.users.cache.get(guardian_discord_id);
    const guardian_username = guardian_user.username + "#" + guardian_user.discriminator
    const guardian_nickname = guardian_member.nickname
    const guardian_name = (guardian_nickname == null) ? guardian_username : student_nickname

    log(`${guardian_name} (${guardian_discord_id}) unclaimed help ticket from ${student_name} (${student_discord_id}) - ${interaction.message.embeds[0].data.title}`)
}

const ticketEmbedBuilder = (props) => {
    let {title, timestamp, footer, userID, description, attachment} = props;
    let ticket = new EmbedBuilder()
        .setColor(0x2A9D8F)
        .setAuthor({name: "Help Request"})
        .setTitle(title)
        .setDescription(description)
        .addFields(
            { name: 'Student:', value: userID, inline: true}
        )
        .setThumbnail(attachment)
        .setTimestamp(timestamp)
        .setFooter({ text: footer });
    
    let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('button-claim')
                .setLabel('Claim')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️'),
            new ButtonBuilder()
                .setCustomId('button-deny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
            );
    
    return {embed: ticket, buttons: buttons};
}   

module.exports = handleUnclaimButton