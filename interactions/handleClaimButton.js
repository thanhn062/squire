const {ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

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
        const messageContent = "this is a test";

        // DM Guardian
        const member = await interaction.guild.members.fetch(guardian_discord_id);
        const user = await member.user.fetch();
        const dmChannel = await user.createDM();
        dmChannel.send({ content: messageContent });

        // DM Student
        const member2 = await interaction.guild.members.fetch(student_discord_id);
        const user2 = await member2.user.fetch();
        const dmChannel2 = await user2.createDM();
        dmChannel2.send({ content: messageContent });
        await interaction.reply({content: "Thanks for claiming this ticket! Please check your DM's for further instruction!", ephemeral: true})

        let inProgressButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('button-inprogress')
                .setLabel('In Progress...')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⌛')
                .setDisabled(true)
        )

        interaction.message.edit({content: `\`Job claimed by: \`` + `<@${guardian_discord_id}>` , components: [inProgressButton]})
    }
}

module.exports = handleClaimButton