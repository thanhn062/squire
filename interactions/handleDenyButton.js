const {ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const log = require('../resources/log/log.js');
const handleDenyButton = async (interaction) => {

    const student_discord_id = interaction.message.embeds[0].data.fields[0].value.replaceAll("<@","").replaceAll(">","")
	const guardian_discord_id = interaction.user.id
    
    // build modal
    const modal = denyModalBuilder()

    // show modal to suer
    await interaction.showModal(modal);

    // Collect modal submit interaction
    const filter = (interaction) => interaction.customId === 'deny-modal';
    interaction.awaitModalSubmit({ filter, time: 15_000 })
    .then(async interaction => {
        let reason = interaction.fields.getTextInputValue("reasonInput");
        // close the modal (by fulfilling promise with empty update)
		interaction.update({});
        // delete the message
        try {
            const messageId = await interaction.message.id;
            const message = await interaction.channel.messages.cache.get(messageId);
            await message.delete();
        } catch (error) {
            console.error(`Failed to delete message: ${error}`);
        }
        // DM Student and give them reason for denial
        const student_member = await interaction.guild.members.cache.get(student_discord_id);
        const student_user = await student_member.user;
        const student_DM = await student_user.createDM();
        const messageContent = '```fix\nYour help request was denied.```__**Reason:**__\n> ' + reason;
        student_DM.send({ content: messageContent });

        // log
        const guardian_username = await interaction.user.username + "#" + interaction.user.discriminator
        const guardian_nickname = await interaction.member.nickname
        const guardian_name = (guardian_nickname == null) ? guardian_username : guardian_nickname

        const student_username = student_user.username + "#" + student_user.discriminator
        const student_nickname = student_member.nickname
        const student_name = (student_nickname == null) ? student_username : student_nickname
        log(`${guardian_name} (${guardian_discord_id}) denied help ticket from ${student_name} (${student_discord_id}) - Reason: ${reason}`)
    })
    .catch(console.error);
}

const denyModalBuilder = () => {
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

    return modal
}
module.exports = handleDenyButton