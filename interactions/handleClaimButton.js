const {ActionRowBuilder, ButtonBuilder, ButtonStyle, Attachment } = require('discord.js')
const dmEmbedBuilder = require('../resources/embeds-msg/help-ticket-DM.js');
const claimedTicketEmbedBuilder = require('../resources/embeds-msg/help-ticket-claimed.js')

const handleClaimButton = async (interaction) => {

    const student_discord_id = interaction.message.embeds[0].data.fields[0].value.replaceAll("<@","").replaceAll(">","")
	const guardian_discord_id = interaction.user.id

    if (student_discord_id.toString() === guardian_discord_id.toString()) {
        console.log("Guardian tried to claim own ticket!")
        await interaction.reply({ content: "You cannot claim your own ticket.", ephemeral: true});
        return;
    }
    else {
        console.log("Ticket claimed! Sending messages to student and guardian")

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
        // await interaction.reply({content: "Thanks for claiming this ticket! Please check your DM's for further instruction!", ephemeral: true})
        interaction.message.edit({embeds: [claimedEmbed.embed], components: [claimedEmbed.buttons]})
    }
}

module.exports = handleClaimButton