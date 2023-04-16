const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const log = require('../resources/log/log.js');
const handleClaimButton = async (interaction) => {

    const student_discord_id = interaction.message.embeds[0].data.fields[0].value.replaceAll("<@","").replaceAll(">","")
	const guardian_discord_id = interaction.user.id

    if (student_discord_id.toString() === guardian_discord_id.toString()) {
        await interaction.reply({ content: "You cannot claim your own ticket.", ephemeral: true});
        return;
    }
    else {
        // DM Guardian
        // get message details and build the embeds prop
        const isoString = interaction.message.embeds[0].data.timestamp;
        const date = new Date(isoString);
        let embedProps = {
            title: interaction.message.embeds[0].data.title,
            timestamp: date,
            footer: interaction.message.embeds[0].data.footer.text,
            userID: interaction.message.embeds[0].data.fields[0].value,
            description: interaction.message.embeds[0].data.description,
            attachment: interaction.message.embeds[0].data.thumbnail.url,
            msgURL: interaction.message.id,
            guardianID: guardian_discord_id
        }
        // build the embeds
        let guardian_ticket = dmEmbedBuilder(embedProps)
        // sends the embeds to guardian by DM
        const member = await interaction.guild.members.fetch(guardian_discord_id);
        const user = await member.user.fetch();
        const dmChannel = await user.createDM();

        const claimedEmbed = claimedTicketEmbedBuilder({...embedProps, guardianID: guardian_discord_id})


        dmChannel.send({content: '```Thank you for helping out our student!\nPlease reach out to them via DM, then come back here to update the status of the ticket once the student has been helped.```', embeds: [guardian_ticket.embed], components: [guardian_ticket.buttons]});

        // DM Student
        const member2 = await interaction.guild.members.fetch(student_discord_id);
        const user2 = await member2.user.fetch();
        const dmChannel2 = await user2.createDM();
        dmChannel2.send({ content: '__**Make sure to check your DMs and Message Requests!**__\nYour ticket has been claimed and the guardian will be reaching out to you shortly.', embeds: [claimedEmbed.embed]});
        await interaction.update({})
        interaction.message.edit({embeds: [claimedEmbed.embed], components: [claimedEmbed.buttons]})
    
        // log
        const username = await interaction.user.username + "#" + interaction.user.discriminator
        const nickname = await interaction.member.nickname
        const name = (nickname == null) ? username : nickname

        const student_username = user2.username + "#" + user2.discriminator
        const student_nickname = member2.nickname
        const student_name = (student_nickname == null) ? student_username : student_nickname
        log(`${name} (${guardian_discord_id}) claimed help ticket from ${student_name} (${student_discord_id})`)
    }
}

function claimedTicketEmbedBuilder(props) {
    let { title, timestamp, footer, userID, description, attachment, guardianID } = props

    let embed = new EmbedBuilder()
    .setColor(0xE9C46A)
    .setAuthor({name: "Help Request"})
	.setTitle(`${title}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `${userID}`, inline: true },
        { name: 'Claimed By:', value: `<@${guardianID}>`, inline: true }
	)
    .setThumbnail(attachment)
	.setTimestamp(timestamp)
	.setFooter({ text: `${footer}`});

    let buttons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('button-inprogress')
            .setLabel('In Progress...')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⌛')
            .setDisabled(true)
    )

    return {embed: embed, buttons: buttons};
}

function dmEmbedBuilder(props) {
    let {title, timestamp, footer, userID, description, attachment, msgURL, guardianID } = props

    let embed = new EmbedBuilder()
    .setColor(0xE9C46A)
    .setAuthor({name: "Help Request"})
	.setTitle(`${title}`)
	.setDescription(`${description}`)
    .addFields(
        { name: 'Student:', value: `${userID}`, inline: true },
        { name: 'Claimed By:', value: `<@${guardianID}>`, inline: true }

	)
    .setThumbnail(attachment)
	.setTimestamp(timestamp)
	.setFooter({ text: `${footer}`});

    let buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button-resolve-' + msgURL)
                .setLabel('Resolve')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️'),
            new ButtonBuilder()
                .setCustomId('button-unclaim-' + msgURL)
                .setLabel('Unclaim')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('✖️')
        )

    return {embed: embed, buttons: buttons};
}

module.exports = handleClaimButton