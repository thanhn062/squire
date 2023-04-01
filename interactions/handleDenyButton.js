const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

const handleDenyButton = async (interaction) => {

    const student_discord_id = interaction.message.embeds[0].data.fields[0].value.replaceAll("<@","").replaceAll(">","")
	const guardian_discord_id = interaction.user.id

    // Create the modal
    const modal = new ModalBuilder()
        .setCustomId('deny-modal')
        .setTitle('Reason For Denial');

    // Add components to modal
    // Create the text input components
    const reasonInput = new TextInputBuilder()
        .setCustomId('reasonInput')
        .setLabel("What's the reason for denial?")
        .setStyle(TextInputStyle.Paragraph);

    const submitButton = new ActionRowBuilder().addComponents(reasonInput);

    // Add inputs to the modal
    modal.addComponents(submitButton);

    // Show the modal to the user
    await interaction.showModal(modal);

    // Collect a modal submit interaction
    const filter = (interaction) => interaction.customId === 'deny-modal';
    interaction.awaitModalSubmit({ filter, time: 15_000 })
    .then(async interaction => {
        let reason = interaction.fields.getTextInputValue("reasonInput");
        // close the modal (by fulfilling promise with empty update)
		interaction.update({});
        // delete the message
        const messageId = interaction.message.id;
        await interaction.channel.messages.delete(messageId);
        // DM Student and give them reason for denial
        const member = await interaction.guild.members.fetch(student_discord_id);
        // const member = await interaction.guild.members.fetch('111622508104450048');
        const user = await member.user.fetch();
        const dmChannel = await user.createDM();
        const messageContent = '```fix\nYour help request was denied.```__**Reason:**__\n> ' + reason;
        dmChannel.send({ content: messageContent });

    })
    .catch(console.error);
}

module.exports = handleDenyButton